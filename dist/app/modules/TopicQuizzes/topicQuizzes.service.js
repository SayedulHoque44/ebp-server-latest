"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicQuizServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const topicQuizzes_model_1 = require("./topicQuizzes.model");
const arguments_model_1 = require("../Arguments/arguments.model");
const argTopics_model_1 = require("../ArgTopics/argTopics.model");
const quizImage_model_1 = require("../QuizImage/quizImage.model");
const queryUpdatedAtRange_1 = __importDefault(require("../../utils/queryUpdatedAtRange"));
const globalUtilsFn_1 = require("../../utils/globalUtilsFn");
const s3_1 = require("../../utils/s3");
const createTopicQuizIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //check argument exits
        const argument = yield arguments_model_1.ArgumentsModel.findById(payload.argumentId);
        if (!argument) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Argument Not Found!");
        }
        //check argTopic exits
        const ArgTopic = yield argTopics_model_1.ArgTopicsModel.findOne({
            _id: payload.ArgTopicId,
            argumentId: payload.argumentId,
        });
        if (!ArgTopic) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Topic Not Found! Or This Topic Not From ${argument.title}`);
        }
        //check quizImage exits
        if (payload.image) {
            const quizImage = yield quizImage_model_1.QuizImageModel.findById(payload.image);
            if (!quizImage) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Quiz Image Not Found!");
            }
        }
        // Create
        const createTopicQuiz = yield topicQuizzes_model_1.TopicQuizModel.create(payload);
        return createTopicQuiz;
    }
    catch (error) {
        const authorAudio = payload.authorAudio;
        if (authorAudio) {
            const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, authorAudio);
            yield (0, s3_1.deleteS3Object)(objectKey);
        }
        throw error;
    }
});
//
const updateTopicQuizIntoDB = (topicQuizId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topicQuiz = yield topicQuizzes_model_1.TopicQuizModel.findById(topicQuizId).populate("argumentId");
        // check quiz exits
        if (!topicQuiz) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Quiz Not Found!");
        }
        //check argument exits
        if (payload.argumentId) {
            const argument = yield arguments_model_1.ArgumentsModel.findById(payload.argumentId);
            if (!argument) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Argument Not Found!");
            }
        }
        //check argTopic exits
        if (payload.ArgTopicId) {
            const ArgTopic = yield argTopics_model_1.ArgTopicsModel.findOne({
                _id: payload.ArgTopicId,
                argumentId: topicQuiz.argumentId,
            });
            if (!ArgTopic) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Topic Not Found! Or This Topic Not From Same Argument`);
            }
        }
        //check quizImage exits
        if (payload.image) {
            const quizImage = yield quizImage_model_1.QuizImageModel.findById(payload.image);
            if (!quizImage) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Quiz Image Not Found!");
            }
        }
        const updatedTopicQuiz = yield topicQuizzes_model_1.TopicQuizModel.findByIdAndUpdate(topicQuizId, payload, {
            new: true,
        });
        // If already there audio exits !! then delet previous one
        if (payload.authorAudio) {
            const previousAuthorAudio = topicQuiz.authorAudio;
            if (previousAuthorAudio) {
                const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, previousAuthorAudio);
                yield (0, s3_1.deleteS3Object)(objectKey);
            }
        }
        //
        return updatedTopicQuiz;
        //
    }
    catch (error) {
        const authorAudio = payload.authorAudio;
        if (authorAudio) {
            const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, authorAudio);
            yield (0, s3_1.deleteS3Object)(objectKey);
        }
        throw error;
    }
});
//
const getSingleTopicQuizByIdFromDb = (topicQuizId) => __awaiter(void 0, void 0, void 0, function* () {
    const topicQuiz = yield topicQuizzes_model_1.TopicQuizModel.findById(topicQuizId).populate("argumentId ArgTopicId image");
    if (!topicQuiz) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Quiz Not Found!");
    }
    return topicQuiz;
});
//
const getTopicQuizzesQueryFromDb = (query) => __awaiter(void 0, void 0, void 0, function* () {
    if (query.count) {
        let result;
        if (query.argumentId) {
            result = yield topicQuizzes_model_1.TopicQuizModel.countDocuments({
                argumentId: query.argumentId,
            });
            return { totalQuizzes: result };
        }
        else if (query.ArgTopicId) {
            result = yield topicQuizzes_model_1.TopicQuizModel.countDocuments({
                ArgTopicId: query.ArgTopicId,
            });
            return { totalQuizzes: result };
        }
        return { message: "Send Atlest ArgumentId or TopicId!" };
    }
    else {
        const TopicQuizzesQuery = new QueryBuilder_1.default(topicQuizzes_model_1.TopicQuizModel.find(), query)
            .search(["question"])
            .filter()
            .sort()
            .paginate()
            .fields();
        const result = yield TopicQuizzesQuery.modelQuery
            .populate({
            path: "ArgTopicId",
            populate: {
                path: "theoryImages",
            },
        })
            .populate("image");
        const meta = yield TopicQuizzesQuery.countTotal();
        return {
            meta,
            result,
        };
    }
});
//
const deleteTopicQuizFromDB = (topicQuizId) => __awaiter(void 0, void 0, void 0, function* () {
    const topicQuiz = yield topicQuizzes_model_1.TopicQuizModel.findById(topicQuizId);
    if (!topicQuiz) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Quiz Not Found!");
    }
    const deleted = yield topicQuizzes_model_1.TopicQuizModel.findByIdAndUpdate(topicQuizId, { isDeleted: true }, { new: true });
    const authorAudio = topicQuiz.authorAudio;
    if (authorAudio) {
        const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, authorAudio);
        yield (0, s3_1.deleteS3Object)(objectKey);
    }
    return deleted;
});
// --------------- App -- aggregate method -- more OW
const getQuizzesQueryFromDbinApp = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // aggregation initial Array
    const aggregateCondition = [];
    const aggregationMatch = { $match: {} };
    // enter match updatedAtRange condition
    if (query.updatedAtGte || query.updatedAtLte) {
        // updatedAt query match for aggreagation
        const updateAtRangeMatch = (0, queryUpdatedAtRange_1.default)(query);
        aggregationMatch.$match = Object.assign(Object.assign({}, aggregationMatch.$match), updateAtRangeMatch);
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
    const result = yield topicQuizzes_model_1.TopicQuizModel.aggregate(aggregateCondition);
    // if getIds query performed and need to return only ids
    if (query.getIds) {
        return result.length > 0 ? result[0].ids : [];
    }
    // or else return the whole result
    return result;
});
exports.TopicQuizServices = {
    createTopicQuizIntoDB,
    updateTopicQuizIntoDB,
    getTopicQuizzesQueryFromDb,
    getSingleTopicQuizByIdFromDb,
    deleteTopicQuizFromDB,
    getQuizzesQueryFromDbinApp,
};
