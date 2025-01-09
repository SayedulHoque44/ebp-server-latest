import httpStatus from "http-status";
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
};
