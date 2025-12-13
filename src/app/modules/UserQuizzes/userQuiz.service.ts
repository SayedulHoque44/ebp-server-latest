import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../error/AppError";
import { TopicQuizModel } from "../TopicQuizzes/topicQuizzes.model";
import { TUserQuiz } from "./userQuiz.interface";
import { UserQuizModel } from "./userQuiz.model";
import { userModel } from "../User/user.model";
import QueryBuilder from "../../../builder/QueryBuilder";

const createUserQuizIntoDB = async (payload: TUserQuiz[]) => {
  // Early validation: check if payload is empty
  if (!payload || payload.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payload cannot be empty!");
  }

  const userId = payload[0].userId;

  // Step 1: Check user exists (single query)
  const user = await userModel.findById(userId).lean();
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
  }

  // Step 2: Batch check all quizzes exist at once (single query)
  const quizIds = [...new Set(payload.map(quiz => quiz.quizId))];
  const existingQuizzes = await TopicQuizModel.find({
    _id: { $in: quizIds },
  })
    .select("_id")
    .lean();

  const existingQuizIds = new Set(
    existingQuizzes.map(quiz => quiz._id.toString()),
  );

  // Filter out invalid quizzes
  const validPayload = payload.filter(quiz =>
    existingQuizIds.has(quiz.quizId.toString()),
  );

  if (validPayload.length === 0) {
    return { user, quizzesAdded: 0 };
  }

  // Step 3: Batch check all existing user quizzes at once (single query)
  const existingUserQuizIds = validPayload.map(quiz => quiz.quizId);
  const existingUserQuizzes = await UserQuizModel.find({
    userId,
    quizId: { $in: existingUserQuizIds },
  }).lean();

  // Create a map for quick lookup: quizId -> existingUserQuiz
  const existingUserQuizMap = new Map(
    existingUserQuizzes.map(quiz => [quiz.quizId.toString(), quiz]),
  );

  // Step 4: Prepare bulk operations (updates and inserts)
  const bulkOps = validPayload.map(madeQuiz => {
    const existingUserQuiz = existingUserQuizMap.get(
      madeQuiz.quizId.toString(),
    );

    if (existingUserQuiz) {
      // Update existing quiz
      return {
        updateOne: {
          filter: { _id: existingUserQuiz._id },
          update: {
            $set: {
              givenAnswer: madeQuiz.givenAnswer,
              isCorrect: madeQuiz.isCorrect,
            },
            $inc: { playedCount: 1 },
          },
        },
      };
    } else {
      // Insert new quiz
      return {
        insertOne: {
          document: {
            ...madeQuiz,
            playedCount: madeQuiz.playedCount || 1,
          },
        },
      };
    }
  });

  // Step 5: Execute all operations in a single bulk write (much faster!)
  if (bulkOps.length > 0) {
    await UserQuizModel.bulkWrite(bulkOps, { ordered: false });
  }

  return { user, quizzesAdded: validPayload.length };
};

const getUserQuizByQuery = async (
  query: Record<string, unknown>,
  userId?: string,
) => {
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "User ID is required!");
  }
  // Convert string boolean to actual boolean for isCorrect
  if (query.isCorrect !== undefined) {
    query.isCorrect = query.isCorrect === "true" || query.isCorrect === true;
  }

  query.userId = userId;

  // console.log(query);
  const userQuiz = new QueryBuilder(UserQuizModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await userQuiz.modelQuery.populate("quizId");
  const meta = await userQuiz.countTotal();
  return {
    meta,
    result,
  };
};

const getRandomPlayedQuizzesFromDB = async () => {
  // Step 1: Get unique quizIds from incorrect UserQuizzes
  const quizIdsResult = await UserQuizModel.aggregate([
    {
      $match: {
        isCorrect: false,
      },
    },
    {
      $sample: { size: 30 },
    },
    {
      $group: {
        _id: "$quizId", // Get unique quizIds to avoid duplicates
      },
    },
  ]);

  // Extract quizIds array - FIX: Use quizId, not _id
  const quizIds = quizIdsResult.map(item => item._id);

  // Early return if no quizzes found
  if (quizIds.length === 0) {
    return { topicQuizzes: [], totalQuizzes: 0 };
  }

  // Step 2: Optimized single aggregation pipeline for TopicQuizzes
  const topicQuizzes = await TopicQuizModel.aggregate([
    // Match TopicQuizzes by quizIds and filter deleted (indexed fields)
    {
      $match: {
        _id: { $in: quizIds },
        isDeleted: false,
      },
    },
    // Lookup ArgTopicId
    {
      $lookup: {
        from: "argtopics",
        localField: "ArgTopicId",
        foreignField: "_id",
        as: "ArgTopicId",
      },
    },
    {
      $unwind: {
        path: "$ArgTopicId",
        preserveNullAndEmptyArrays: true,
      },
    },
    // Lookup image
    {
      $lookup: {
        from: "quizimages",
        localField: "image",
        foreignField: "_id",
        as: "image",
      },
    },
    {
      $unwind: {
        path: "$image",
        preserveNullAndEmptyArrays: true,
      },
    },
    // Populate theoryImages (extract array first, then lookup)
    {
      $addFields: {
        theoryImagesIds: "$ArgTopicId.theoryImages",
      },
    },
    {
      $lookup: {
        from: "quizimages",
        localField: "theoryImagesIds",
        foreignField: "_id",
        as: "theoryImagesPopulated",
      },
    },
    {
      $addFields: {
        "ArgTopicId.theoryImages": "$theoryImagesPopulated",
      },
    },
    // Clean up temporary fields
    {
      $project: {
        theoryImagesPopulated: 0,
        theoryImagesIds: 0,
      },
    },
  ]);

  return { topicQuizzes, totalQuizzes: topicQuizzes.length };
};

const geSingletUserQuizStatisticsFromDB = async (userId: string) => {
  const totalQuizzes = await TopicQuizModel.countDocuments();
  const totalCorrectQuizzes = await UserQuizModel.countDocuments({
    userId,
    isCorrect: true,
  });
  const totalinCorrectQuizzes = await UserQuizModel.countDocuments({
    userId,
    isCorrect: false,
  });

  // Calculate total sum of playedCount for all quizzes played by this user
  const quizPlayedTotalCountResult = await UserQuizModel.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        totalPlayedCount: { $sum: "$playedCount" },
      },
    },
  ]);

  const totalPlayedCount =
    quizPlayedTotalCountResult.length > 0
      ? quizPlayedTotalCountResult[0].totalPlayedCount
      : 0;

  const remainingQuizzes = totalQuizzes - totalCorrectQuizzes;
  return {
    totalQuizzes,
    totalCorrectQuizzes,
    totalinCorrectQuizzes,
    totalPlayedCount,
    remainingQuizzes,
  };
};

export const userQuizService = {
  createUserQuizIntoDB,
  getUserQuizByQuery,
  getRandomPlayedQuizzesFromDB,
  geSingletUserQuizStatisticsFromDB,
};
