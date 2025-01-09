import httpStatus from "http-status";
import QueryBuilder from "../../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { QuizImageModel } from "./quizImage.model";
import { TQuizImage } from "./quizImage.interface";
import queryUpdatedAtRange from "../../utils/queryUpdatedAtRange";
import { ArgumentsModel } from "../Arguments/arguments.model";
import { ArgTopicsModel } from "../ArgTopics/argTopics.model";
import { TopicQuizModel } from "../TopicQuizzes/topicQuizzes.model";
import {
  EBP_Images_CDN_BaseUrl,
  getObjectKeyFromUrl,
} from "../../utils/globalUtilsFn";
import { deleteS3Object } from "../../utils/s3";

const createQuizImageIntoDB = async (payload: TQuizImage) => {
  try {
    // check if u try to a enter figure name which is alreay exits
    const exitsSameFigure = await QuizImageModel.findOne({
      figure: payload.figure,
    });
    if (exitsSameFigure) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "This Figure Name Already Exits!",
      );
    }
    // check if u try to a enter image which is alreay exits
    const exitsSameImage = await QuizImageModel.findOne({
      imageUrl: payload.imageUrl,
    });
    if (exitsSameImage) {
      throw new AppError(httpStatus.BAD_REQUEST, "This Image Already Exits!");
    }

    const QuizImage = await QuizImageModel.create(payload);
    return QuizImage;
  } catch (error) {
    const imageUrl = payload.imageUrl;
    if (imageUrl) {
      const objectKey = getObjectKeyFromUrl(EBP_Images_CDN_BaseUrl, imageUrl);
      await deleteS3Object(objectKey);
    }
    throw error;
  }
};

const updateQuizImageIntoDB = async (
  QuizImageId: string,
  payload: Partial<TQuizImage>,
) => {
  const QuizImage = await QuizImageModel.findById(QuizImageId);

  if (!QuizImage) {
    throw new AppError(httpStatus.NOT_FOUND, "QuizImage Not Found!");
  }
  // check if u try to a enter figure name which is alreay exits
  if (payload?.figure) {
    const exitsSameFigure = await QuizImageModel.findOne({
      _id: {
        $ne: QuizImageId,
      },
      figure: payload.figure,
    });
    if (exitsSameFigure) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "This Figure Name Already Exits!",
      );
    }
  }

  // check if u try to a enter image which is alreay exits
  if (payload?.imageUrl) {
    const exitsSameImage = await QuizImageModel.findOne({
      _id: {
        $ne: QuizImageId,
      },
      imageUrl: payload.imageUrl,
    });
    if (exitsSameImage) {
      throw new AppError(httpStatus.BAD_REQUEST, "This Image Already Exits!");
    }
  }

  const updatedQuizImage = await QuizImageModel.findByIdAndUpdate(
    QuizImageId,
    payload,
    {
      new: true,
    },
  );
  return updatedQuizImage;
};

const getSingleQuizImageByIdFromDb = async (QuizImageId: string) => {
  const QuizImage = await QuizImageModel.findById(QuizImageId);

  if (!QuizImage) {
    throw new AppError(httpStatus.NOT_FOUND, "QuizImage Not Found!");
  }

  return QuizImage;
};

const getQuizImageMetaById = async (QuizImageId: string) => {
  const QuizImage = await QuizImageModel.findById(QuizImageId);

  if (!QuizImage) {
    throw new AppError(httpStatus.NOT_FOUND, "QuizImage Not Found!");
  }

  const argumentFound = await ArgumentsModel.find({
    image: QuizImageId,
  }).select("title");

  const argTopicFound = await ArgTopicsModel.find({
    image: QuizImageId,
  }).select("title");

  const argTopicTheory = await ArgTopicsModel.find({
    theoryImages: QuizImageId,
  }).select("title");

  const quizFound = await TopicQuizModel.find({
    image: QuizImageId,
  }).select("question");

  return {
    argumentFound,
    argTopicFound,
    argTopicTheory,
    quizFound,
  };
};

const getQuizImagesQueryFromDb = async (query: Record<string, unknown>) => {
  const QuizImagesQuery = new QueryBuilder(QuizImageModel.find(), query)
    .search(["figure"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await QuizImagesQuery.modelQuery;
  const meta = await QuizImagesQuery.countTotal();
  return {
    meta,
    result,
  };
};

const deleteQuizImageFromDB = async (QuizImageId: string) => {
  const QuizImage = await QuizImageModel.findById(QuizImageId);

  if (!QuizImage) {
    throw new AppError(httpStatus.NOT_FOUND, "QuizImage Not Found!");
  }
  const deleted = await QuizImageModel.findByIdAndDelete(QuizImageId);

  const objectKey = getObjectKeyFromUrl(
    EBP_Images_CDN_BaseUrl,
    QuizImage.imageUrl,
  );
  await deleteS3Object(objectKey);

  return deleted;
};

// --------------- App -- aggregate method -- more OW
const getQuizImagesQueryFromDbinApp = async (
  query: Record<string, unknown>,
) => {
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
  const result = await QuizImageModel.aggregate(aggregateCondition);

  // if getIds query performed and need to return only ids
  if (query.getIds) {
    return result.length > 0 ? result[0].ids : [];
  }
  // or else return the whole result
  return result;
};

export const QuizImageServices = {
  createQuizImageIntoDB,
  updateQuizImageIntoDB,
  getQuizImagesQueryFromDb,
  getSingleQuizImageByIdFromDb,
  deleteQuizImageFromDB,
  getQuizImagesQueryFromDbinApp,
  getQuizImageMetaById,
};
