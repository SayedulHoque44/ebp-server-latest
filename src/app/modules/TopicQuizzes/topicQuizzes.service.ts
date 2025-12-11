import httpStatus from "http-status";
import { Types } from "mongoose";
import QueryBuilder from "../../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { TTopicQuiz } from "./topicQuizzes.interface";
import { TopicQuizModel } from "./topicQuizzes.model";
import { ArgumentsModel } from "../Arguments/arguments.model";
import { ArgTopicsModel } from "../ArgTopics/argTopics.model";
import { QuizImageModel } from "../QuizImage/quizImage.model";
import queryUpdatedAtRange from "../../utils/queryUpdatedAtRange";
import {
  EBP_Images_CDN_BaseUrl,
  getObjectKeyFromUrl,
} from "../../utils/globalUtilsFn";
import { deleteS3Object } from "../../utils/s3";

const createTopicQuizIntoDB = async (payload: TTopicQuiz) => {
  try {
    //check argument exits
    const argument = await ArgumentsModel.findById(payload.argumentId);
    if (!argument) {
      throw new AppError(httpStatus.NOT_FOUND, "Argument Not Found!");
    }
    //check argTopic exits
    const ArgTopic = await ArgTopicsModel.findOne({
      _id: payload.ArgTopicId,
      argumentId: payload.argumentId,
    });
    if (!ArgTopic) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Topic Not Found! Or This Topic Not From ${argument.title}`,
      );
    }

    //check quizImage exits
    if (payload.image) {
      const quizImage = await QuizImageModel.findById(payload.image);
      if (!quizImage) {
        throw new AppError(httpStatus.NOT_FOUND, "Quiz Image Not Found!");
      }
    }

    // Create
    const createTopicQuiz = await TopicQuizModel.create(payload);
    return createTopicQuiz;
  } catch (error) {
    const authorAudio = payload.authorAudio;
    if (authorAudio) {
      const objectKey = getObjectKeyFromUrl(
        EBP_Images_CDN_BaseUrl,
        authorAudio,
      );
      await deleteS3Object(objectKey);
    }
    throw error;
  }
};

//
const updateTopicQuizIntoDB = async (
  topicQuizId: string,
  payload: Partial<TTopicQuiz>,
) => {
  try {
    const topicQuiz =
      await TopicQuizModel.findById(topicQuizId).populate("argumentId");

    // check quiz exits
    if (!topicQuiz) {
      throw new AppError(httpStatus.NOT_FOUND, "Quiz Not Found!");
    }

    //check argument exits
    if (payload.argumentId) {
      const argument = await ArgumentsModel.findById(payload.argumentId);
      if (!argument) {
        throw new AppError(httpStatus.NOT_FOUND, "Argument Not Found!");
      }
    }

    //check argTopic exits
    if (payload.ArgTopicId) {
      const ArgTopic = await ArgTopicsModel.findOne({
        _id: payload.ArgTopicId,
        argumentId: topicQuiz.argumentId,
      });
      if (!ArgTopic) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Topic Not Found! Or This Topic Not From Same Argument`,
        );
      }
    }

    //check quizImage exits
    if (payload.image) {
      const quizImage = await QuizImageModel.findById(payload.image);
      if (!quizImage) {
        throw new AppError(httpStatus.NOT_FOUND, "Quiz Image Not Found!");
      }
    }

    const updatedTopicQuiz = await TopicQuizModel.findByIdAndUpdate(
      topicQuizId,
      payload,
      {
        new: true,
      },
    );

    // If already there audio exits !! then delet previous one
    if (payload.authorAudio) {
      const previousAuthorAudio = topicQuiz.authorAudio;
      if (previousAuthorAudio) {
        const objectKey = getObjectKeyFromUrl(
          EBP_Images_CDN_BaseUrl,
          previousAuthorAudio,
        );
        await deleteS3Object(objectKey);
      }
    }
    //
    return updatedTopicQuiz;
    //
  } catch (error) {
    const authorAudio = payload.authorAudio;
    if (authorAudio) {
      const objectKey = getObjectKeyFromUrl(
        EBP_Images_CDN_BaseUrl,
        authorAudio,
      );
      await deleteS3Object(objectKey);
    }
    throw error;
  }
};

//
const getSingleTopicQuizByIdFromDb = async (topicQuizId: string) => {
  const topicQuiz = await TopicQuizModel.findById(topicQuizId).populate(
    "argumentId ArgTopicId image",
  );

  if (!topicQuiz) {
    throw new AppError(httpStatus.NOT_FOUND, "Quiz Not Found!");
  }

  return topicQuiz;
};

//
const getTopicQuizzesQueryFromDb = async (query: Record<string, unknown>) => {
  if (query.count) {
    let result;
    if (query.argumentId) {
      result = await TopicQuizModel.countDocuments({
        argumentId: query.argumentId,
      });

      return { totalQuizzes: result };
    } else if (query.ArgTopicId) {
      result = await TopicQuizModel.countDocuments({
        ArgTopicId: query.ArgTopicId,
      });

      return { totalQuizzes: result };
    }
    return { message: "Send Atlest ArgumentId or TopicId!" };
  } else {
    const TopicQuizzesQuery = new QueryBuilder(TopicQuizModel.find(), query)
      .search(["question"])
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await TopicQuizzesQuery.modelQuery
      .populate({
        path: "ArgTopicId",
        populate: {
          path: "theoryImages",
        },
      })
      .populate("image");
    const meta = await TopicQuizzesQuery.countTotal();
    return {
      meta,
      result,
    };
  }
};

//
const getRandomTopicQuizzesByTopicsIdsFromDb = async (topicsIds: string[]) => {
  // Convert to ObjectIds once before the pipeline for better performance
  const topicObjectIds = topicsIds.map(id => new Types.ObjectId(id));

  const topicQuizzes = await TopicQuizModel.aggregate([
    {
      $match: {
        ArgTopicId: { $in: topicObjectIds },
        isDeleted: false, // CRITICAL: Filter deleted quizzes before sampling
      },
    },
    // Sample after filtering to work on smaller dataset
    { $sample: { size: 30 } },
    // Populate ArgTopicId with theoryImages
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
    // Populate image
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
    // Populate theoryImages
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
        as: "theoryImagesTemp",
      },
    },
    {
      $addFields: {
        "ArgTopicId.theoryImages": "$theoryImagesTemp",
      },
    },
    {
      $project: {
        theoryImagesTemp: 0,
        theoryImagesIds: 0,
      },
    },
  ]);
  return { topicQuizzes, totalQuizzes: topicQuizzes.length };
};

//
const getRandomThirtyQuizzesFromDB = async () => {
  // Get all arguments (assuming there are always 25)
  const allArguments = await ArgumentsModel.find({ isDeleted: false })
    .select("_id")
    .lean();

  if (allArguments.length < 25) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Not Enough Arguments! Need at least 25 arguments to make 30 quizzes!",
    );
  }

  // Split arguments: first 5 and remaining 20
  const firstFiveArguments = allArguments.slice(0, 5);
  const remainingTwentyArguments = allArguments.slice(5, 25);

  // Parallelize all queries using Promise.all - this is MUCH faster than sequential
  const firstFivePromises = firstFiveArguments.map(argument =>
    TopicQuizModel.aggregate([
      {
        $match: {
          argumentId: argument._id,
          isDeleted: false,
        },
      },
      {
        $sample: { size: 2 }, // Randomly select 2 quizzes
      },
    ]),
  );

  const remainingTwentyPromises = remainingTwentyArguments.map(argument =>
    TopicQuizModel.aggregate([
      {
        $match: {
          argumentId: argument._id,
          isDeleted: false,
        },
      },
      {
        $sample: { size: 1 }, // Randomly select 1 quiz
      },
    ]),
  );

  // Execute all queries in parallel
  const [firstFiveResults, remainingTwentyResults] = await Promise.all([
    Promise.all(firstFivePromises),
    Promise.all(remainingTwentyPromises),
  ]);

  // Flatten results and validate
  const selectedQuizzes: (TTopicQuiz & { _id: Types.ObjectId })[] = [];

  // Validate and collect first 5 arguments' quizzes
  for (let i = 0; i < firstFiveResults.length; i++) {
    const quizzes = firstFiveResults[i];
    if (quizzes.length < 2) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Not enough quizzes in argument ${firstFiveArguments[i]._id}. Need at least 2 quizzes per argument from first 5 arguments.`,
      );
    }
    selectedQuizzes.push(...quizzes);
  }

  // Validate and collect remaining 20 arguments' quizzes
  for (let i = 0; i < remainingTwentyResults.length; i++) {
    const quizzes = remainingTwentyResults[i];
    if (quizzes.length < 1) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Not enough quizzes in argument ${remainingTwentyArguments[i]._id}. Need at least 1 quiz per argument from remaining 20 arguments.`,
      );
    }
    selectedQuizzes.push(...quizzes);
  }

  // Use single aggregation with $lookup for population instead of separate populate
  // This is more efficient than Mongoose populate
  const populatedQuizzes = await TopicQuizModel.aggregate([
    {
      $match: {
        _id: { $in: selectedQuizzes.map(q => q._id) },
      },
    },
    // Populate ArgTopicId with theoryImages
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
        as: "theoryImagesTemp",
      },
    },
    {
      $addFields: {
        "ArgTopicId.theoryImages": "$theoryImagesTemp",
      },
    },
    {
      $project: {
        theoryImagesTemp: 0,
        theoryImagesIds: 0,
      },
    },
    // Populate image
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
  ]);

  return populatedQuizzes;
};
//
const deleteTopicQuizFromDB = async (topicQuizId: string) => {
  const topicQuiz = await TopicQuizModel.findById(topicQuizId);

  if (!topicQuiz) {
    throw new AppError(httpStatus.NOT_FOUND, "Quiz Not Found!");
  }
  const deleted = await TopicQuizModel.findByIdAndUpdate(
    topicQuizId,
    { isDeleted: true },
    { new: true },
  );
  const authorAudio = topicQuiz.authorAudio;
  if (authorAudio) {
    const objectKey = getObjectKeyFromUrl(EBP_Images_CDN_BaseUrl, authorAudio);
    await deleteS3Object(objectKey);
  }
  return deleted;
};
// --------------- App -- aggregate method -- more OW
const getQuizzesQueryFromDbinApp = async (query: Record<string, unknown>) => {
  // aggregation initial Array
  const aggregateCondition = [];
  const aggregationMatch = { $match: {} };

  // enter match updatedAtRange condition
  if (query.updatedAtGte || query.updatedAtLte) {
    // updatedAt query match for aggreagation
    const updateAtRangeMatch = queryUpdatedAtRange(query);
    aggregationMatch.$match = {
      ...aggregationMatch.$match,
      ...updateAtRangeMatch,
    };
  }
  // enter to aggregation array as $match
  aggregateCondition.push(aggregationMatch);

  // get ids
  if (query.getIds) {
    // stage01 - return only id
    aggregateCondition.push({ $project: { _id: 1 } });
    // stage02 - create group and and enter all id in the ids
    aggregateCondition.push({ $group: { _id: null, ids: { $push: "$_id" } } });
    // stage03 - return ids only
    aggregateCondition.push({ $project: { _id: 1, ids: 1 } });
  }

  // console.dir(aggregateCondition, { depth: null });

  // perform the Query :
  const result = await TopicQuizModel.aggregate(aggregateCondition);

  // if getIds query performed and need to return only ids
  if (query.getIds) {
    return result.length > 0 ? result[0].ids : [];
  }
  // or else return the whole result
  return result;
};
export const TopicQuizServices = {
  createTopicQuizIntoDB,
  updateTopicQuizIntoDB,
  getTopicQuizzesQueryFromDb,
  getSingleTopicQuizByIdFromDb,
  deleteTopicQuizFromDB,
  getQuizzesQueryFromDbinApp,
  getRandomTopicQuizzesByTopicsIdsFromDb,
  getRandomThirtyQuizzesFromDB,
};
