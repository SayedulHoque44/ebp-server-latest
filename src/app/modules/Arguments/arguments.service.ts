import httpStatus from "http-status";
import QueryBuilder from "../../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { TArgument } from "./arguments.interface";
import { ArgumentsModel } from "./arguments.model";
import { QuizImageModel } from "../QuizImage/quizImage.model";
import mongoose from "mongoose";
import { ArgTopicsModel } from "../ArgTopics/argTopics.model";
import { TopicQuizModel } from "../TopicQuizzes/topicQuizzes.model";
import queryUpdatedAtRange from "../../utils/queryUpdatedAtRange";

const createArgumentIntoDB = async (payload: TArgument) => {
  //check image id is exits
  if (payload.image) {
    const image = await QuizImageModel.findById(payload.image);

    if (!image) {
      throw new AppError(httpStatus.NOT_FOUND, "Image not found");
    }
  }
  // check if u try to a enter figure name which is alreay exits
  const exitsSameArgu = await ArgumentsModel.findOne({
    title: payload.title,
  });
  if (exitsSameArgu) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This Argument Name Already Exits!",
    );
  }

  const createArg = await ArgumentsModel.create(payload);
  return createArg;
};

const updateArgumentIntoDB = async (
  argId: string,
  payload: Partial<TArgument>,
) => {
  const argument = await ArgumentsModel.findById(argId);

  if (!argument) {
    throw new AppError(httpStatus.NOT_FOUND, "Argument Not Found!");
  }

  // check if u try to a enter title name which is alreay exits
  if (payload?.title) {
    const exitsSameFigure = await ArgumentsModel.findOne({
      _id: {
        $ne: argId,
      },
      title: payload.title,
    });
    if (exitsSameFigure) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "This Argument Name Already Exits!",
      );
    }
  }

  const updatedArg = await ArgumentsModel.findByIdAndUpdate(argId, payload, {
    new: true,
  });
  return updatedArg;
};

const getSingleArgumentByIdFromDb = async (argId: string) => {
  const singleArg = await ArgumentsModel.findById(argId).populate("image");

  if (!singleArg) {
    throw new AppError(httpStatus.NOT_FOUND, "Argument Not Found!");
  }

  // const totalQuizzes = await TopicQuizModel.countDocuments({
  //   argumentId: singleArg._id,
  // });

  // return {
  //   singleArg,
  //   totalQuizzes,
  // };
  return singleArg;
};

const getArgumentsQueryFromDb = async (query: Record<string, unknown>) => {
  const countWQuery = query.count ? query.count : false;
  delete query.count;
  const argumentsQuery = new QueryBuilder(ArgumentsModel.find(), query)
    .search(["title"])
    .filter()
    .sort()
    .paginate()
    .fields();

  let result = await argumentsQuery.modelQuery.populate("image");

  const meta = await argumentsQuery.countTotal();

  if (countWQuery) {
    result = await Promise.all(
      result.map(async (arg: any) => {
        const totalQuizzes = await TopicQuizModel.countDocuments({
          argumentId: arg._id,
        });

        return {
          ...arg.toObject(),
          totalQuizzes,
        };
      }),
    );
  }
  return {
    meta,
    result,
  };
};
// --------------- App -- find method
// const getArgumentsQueryFromDbinApp = async (query: Record<string, unknown>) => {
//   let result;

//   // if try to retrive only ids from result doc
//   if (query.getIds) {
//     result = await ArgumentsModel.aggregate([
//       { $project: { _id: 1 } },
//       { $group: { _id: null, ids: { $push: "$_id" } } },
//       { $project: { _id: 1, ids: 1 } },
//     ]);

//     return result.length > 0 ? result[0].ids : [];
//   }

//   //
//   result = ArgumentsModel.find();
//   // updatedat getter then
//   if (query?.updatedAtGte) {
//     result.find({
//       updatedAt: {
//         $gte: query.updatedAtGte,
//       },
//     });
//   }
//   // updatedat getter then
//   if (query?.updatedAtLte) {
//     result.find({
//       updatedAt: {
//         $lte: query.updatedAtLte,
//       },
//     });
//   }
//   return await result;
// };

// --------------- App -- aggregate method -- more OW
const getArgumentsQueryFromDbinApp = async (query: Record<string, unknown>) => {
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
  const result = await ArgumentsModel.aggregate(aggregateCondition);

  // if getIds query performed and need to return only ids
  if (query.getIds) {
    return result.length > 0 ? result[0].ids : [];
  }
  // or else return the whole result
  return result;
};

const deleteArgumentFromDB = async (argId: string) => {
  const argument = await ArgumentsModel.findById(argId);

  if (!argument) {
    throw new AppError(httpStatus.NOT_FOUND, "Argument Not Found!");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // delete argument
    const deletedArgument = await ArgumentsModel.findByIdAndUpdate(
      argId,
      {
        isDeleted: true,
      },
      {
        session,
      },
    );
    if (!deletedArgument) {
      throw new AppError(httpStatus.NOT_FOUND, "Faild to delete!");
    }

    // delete related topic
    const deleteArgTopics = await ArgTopicsModel.updateMany(
      {
        argumentId: argId,
      },
      {
        isDeleted: true,
      },
      { session },
    );
    if (!deleteArgTopics) {
      throw new AppError(httpStatus.NOT_FOUND, "Faild to delete!");
    }

    // delete related quizzes
    const deleteTopicQuizzes = await TopicQuizModel.updateMany(
      {
        argumentId: argId,
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
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete argument!");
  }
};

export const ArgumentServices = {
  createArgumentIntoDB,
  updateArgumentIntoDB,
  getArgumentsQueryFromDb,
  getSingleArgumentByIdFromDb,
  deleteArgumentFromDB,
  getArgumentsQueryFromDbinApp,
};
