import httpStatus from "http-status";
import QueryBuilder from "../../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { TArgTopic } from "./argTopics.interface";
import { ArgTopicsModel } from "./argTopics.model";
import { QuizImageModel } from "../QuizImage/quizImage.model";
import { ArgumentsModel } from "../Arguments/arguments.model";
import queryUpdatedAtRange from "../../utils/queryUpdatedAtRange";
import mongoose from "mongoose";
import { TopicQuizModel } from "../TopicQuizzes/topicQuizzes.model";

const createArgTopicIntoDB = async (payload: TArgTopic) => {
  // check argument id exits
  const argument = await ArgumentsModel.findById(payload.argumentId);
  if (!argument) {
    throw new AppError(httpStatus.NOT_FOUND, "Argument not found!");
  }

  // check image id exits
  if (payload?.image) {
    const image = await QuizImageModel.findById(payload.image);
    if (!image) {
      throw new AppError(httpStatus.NOT_FOUND, "image not found!");
    }
  }

  //check theroy image exits
  if (payload.theoryImages && payload.theoryImages.length > 0) {
    const isTheoryImagesExits = await QuizImageModel.find({
      _id: {
        $in: payload.theoryImages,
      },
    });

    if (isTheoryImagesExits.length !== payload.theoryImages.length) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Given Theory Images not found!",
      );
    }
  }

  const createArgTopic = await ArgTopicsModel.create(payload);
  return createArgTopic;
};

const updateArgTopicIntoDB = async (
  argTopicId: string,
  payload: Partial<TArgTopic>,
) => {
  // stop to direct changes in theoryImages field
  // if (payload?.theoryImages) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "You Cannot Updated theory images directly!",
  //   );
  // }

  // check updating argumentId exits
  if (payload?.argumentId) {
    const argument = await ArgumentsModel.findById(payload.argumentId);
    if (!argument) {
      throw new AppError(httpStatus.NOT_FOUND, "Argument not found!");
    }
  }

  // check updating image exits
  if (payload?.image) {
    const image = await QuizImageModel.findById(payload.image);
    if (!image) {
      throw new AppError(httpStatus.NOT_FOUND, "image not found!");
    }
  }

  // is argTopic exits
  const argTopic = await ArgTopicsModel.findById(argTopicId);
  if (!argTopic) {
    throw new AppError(httpStatus.NOT_FOUND, "Argument Topic Not Found!");
  }

  const updatedArgTopic = await ArgTopicsModel.findByIdAndUpdate(
    argTopicId,
    payload,
    {
      new: true,
    },
  );
  return updatedArgTopic;
};

const getSingleArgTopicByIdFromDb = async (argTopicId: string) => {
  const argTopic =
    await ArgTopicsModel.findById(argTopicId).populate("theoryImages");

  if (!argTopic) {
    throw new AppError(httpStatus.NOT_FOUND, "Argument Topic Not Found!");
  }

  return argTopic;
};

// This function seems generally okay based on the signature and usage.
// It takes a `query` object and an array of `argumentIds`, builds up a query using QueryBuilder,
// filters by those provided ids if the array is non-empty, then returns paginated results with some populations.
//
// A couple of minor suggestions for robustness/readability (not errors):
//  - confirm that argumentIds will always be provided (default to [] if not?)
//  - check for null/undefined before .length on argumentIds
// Otherwise, it works as intended.
const getArgTopicsQueryFromDb = async (
  query: Record<string, unknown>,
  argumentIds: string[] = [],
) => {
  const countWQuery = query.count ? query.count : false;
  delete query.count;
  const argTopicsQuery = new QueryBuilder(ArgTopicsModel.find(), query)
    .search(["title", "theory"])
    .filter()
    .sort()
    .paginate()
    .fields();
  if (Array.isArray(argumentIds) && argumentIds.length > 0) {
    argTopicsQuery.modelQuery.where({
      argumentId: {
        $in: argumentIds,
      },
    });
  }

  let result = await argTopicsQuery.modelQuery.populate(
    "image theoryImages argumentId",
  );
  const meta = await argTopicsQuery.countTotal();

  if (countWQuery) {
    // Extract all ArgTopic IDs from the result
    const argTopicIds = (result as (mongoose.Document & TArgTopic)[]).map(
      argTopic => argTopic._id,
    );

    // Get all quiz counts in a single aggregation query
    const quizCounts = await TopicQuizModel.aggregate([
      {
        $match: {
          ArgTopicId: { $in: argTopicIds },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$ArgTopicId",
          totalQuizzes: { $sum: 1 },
        },
      },
    ]);

    // Create a map for O(1) lookup
    const countMap = new Map(
      quizCounts.map(item => [item._id.toString(), item.totalQuizzes]),
    );

    // Merge counts into results
    result = (result as (mongoose.Document & TArgTopic)[]).map(argTopic => ({
      ...argTopic.toObject(),
      totalQuizzes: countMap.get(argTopic._id.toString()) || 0,
    }));
  }

  return {
    meta,
    result,
  };
};

const deleteArgTopicFromDB = async (argTopicId: string) => {
  const argTopic = await ArgTopicsModel.findById(argTopicId);

  if (!argTopic) {
    throw new AppError(httpStatus.NOT_FOUND, "Argument Topic Not Found!");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // delete argument
    const deletedArgTopic = await ArgTopicsModel.findByIdAndUpdate(
      argTopicId,
      { isDeleted: true },
      {
        session,
      },
    );
    if (!deletedArgTopic) {
      throw new AppError(httpStatus.NOT_FOUND, "Faild to delete!");
    }
    // delete related quizzes
    const deleteTopicQuizzes = await TopicQuizModel.updateMany(
      {
        ArgTopicId: argTopicId,
      },
      {
        isDeleted: true,
      },
      { session },
    );
    if (!deleteTopicQuizzes) {
      throw new AppError(httpStatus.NOT_FOUND, "Faild to delete!");
    }

    await session.commitTransaction();
    await session.endSession();

    return null;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete Topic!");
  }
};
//
const addTheroyImagesInArgTopic = async (
  argTopicId: string,
  payload: { theoryImages: string[] },
) => {
  if (payload.theoryImages.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Request theroy images cannot be empty!",
    );
  }

  const argTopic = await ArgTopicsModel.findById(argTopicId);

  if (!argTopic) {
    throw new AppError(httpStatus.NOT_FOUND, "Argument Topic Not Found!");
  }

  //check theroy image exits
  const isTheoryImagesExits = await QuizImageModel.find({
    _id: {
      $in: payload.theoryImages,
    },
  });

  if (isTheoryImagesExits.length !== payload.theoryImages.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Given Theory Images not found!");
  }

  const updated = await ArgTopicsModel.findByIdAndUpdate(
    argTopicId,
    {
      $addToSet: {
        theoryImages: {
          $each: payload.theoryImages,
        },
      },
    },
    {
      new: true,
    },
  );
  return updated;
};
//
const deleteTheroyImagesFromArgTopic = async (
  argTopicId: string,
  payload: { theoryImages: string[] },
) => {
  if (payload.theoryImages.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Request theroy images cannot be empty!",
    );
  }

  const argTopic = await ArgTopicsModel.findById(argTopicId);

  if (!argTopic) {
    throw new AppError(httpStatus.NOT_FOUND, "Argument Topic Not Found!");
  }

  const updated = await ArgTopicsModel.findByIdAndUpdate(
    argTopicId,
    {
      $pull: {
        theoryImages: {
          $in: payload.theoryImages,
        },
      },
    },
    {
      new: true,
    },
  );
  return updated;
};

// --------------- App
const getArgTopicsQueryFromDbinApp = async (query: Record<string, unknown>) => {
  // aggregation initial Array
  const aggregateCondition = [];
  const aggregationMatch = { $match: {} };

  // updatedAt query match for aggreagation
  const updateAtRangeMatch = queryUpdatedAtRange(query);

  // enter match updatedAtRange condition
  if (query.updatedAtGte || query.updatedAtLte) {
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
  const result = await ArgTopicsModel.aggregate(aggregateCondition);

  // if getIds query performed and need to return only ids
  if (query.getIds) {
    return result.length > 0 ? result[0].ids : [];
  }
  // or else return the whole result
  return result;
};

export const ArgTopicServices = {
  createArgTopicIntoDB,
  updateArgTopicIntoDB,
  getArgTopicsQueryFromDb,
  getSingleArgTopicByIdFromDb,
  deleteArgTopicFromDB,
  addTheroyImagesInArgTopic,
  deleteTheroyImagesFromArgTopic,
  getArgTopicsQueryFromDbinApp,
};
