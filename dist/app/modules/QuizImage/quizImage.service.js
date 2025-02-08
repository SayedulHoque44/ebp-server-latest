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
exports.QuizImageServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const quizImage_model_1 = require("./quizImage.model");
const queryUpdatedAtRange_1 = __importDefault(require("../../utils/queryUpdatedAtRange"));
const arguments_model_1 = require("../Arguments/arguments.model");
const argTopics_model_1 = require("../ArgTopics/argTopics.model");
const topicQuizzes_model_1 = require("../TopicQuizzes/topicQuizzes.model");
const globalUtilsFn_1 = require("../../utils/globalUtilsFn");
const s3_1 = require("../../utils/s3");
const createQuizImageIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check if u try to a enter figure name which is alreay exits
        const exitsSameFigure = yield quizImage_model_1.QuizImageModel.findOne({
            figure: payload.figure,
        });
        if (exitsSameFigure) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Figure Name Already Exits!");
        }
        // check if u try to a enter image which is alreay exits
        const exitsSameImage = yield quizImage_model_1.QuizImageModel.findOne({
            imageUrl: payload.imageUrl,
        });
        if (exitsSameImage) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Image Already Exits!");
        }
        const QuizImage = yield quizImage_model_1.QuizImageModel.create(payload);
        return QuizImage;
    }
    catch (error) {
        const imageUrl = payload.imageUrl;
        if (imageUrl) {
            const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, imageUrl);
            yield (0, s3_1.deleteS3Object)(objectKey);
        }
        throw error;
    }
});
const updateQuizImageIntoDB = (QuizImageId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const QuizImage = yield quizImage_model_1.QuizImageModel.findById(QuizImageId);
    if (!QuizImage) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "QuizImage Not Found!");
    }
    // check if u try to a enter figure name which is alreay exits
    if (payload === null || payload === void 0 ? void 0 : payload.figure) {
        const exitsSameFigure = yield quizImage_model_1.QuizImageModel.findOne({
            _id: {
                $ne: QuizImageId,
            },
            figure: payload.figure,
        });
        if (exitsSameFigure) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Figure Name Already Exits!");
        }
    }
    // check if u try to a enter image which is alreay exits
    if (payload === null || payload === void 0 ? void 0 : payload.imageUrl) {
        const exitsSameImage = yield quizImage_model_1.QuizImageModel.findOne({
            _id: {
                $ne: QuizImageId,
            },
            imageUrl: payload.imageUrl,
        });
        if (exitsSameImage) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Image Already Exits!");
        }
    }
    const updatedQuizImage = yield quizImage_model_1.QuizImageModel.findByIdAndUpdate(QuizImageId, payload, {
        new: true,
    });
    return updatedQuizImage;
});
const getSingleQuizImageByIdFromDb = (QuizImageId) => __awaiter(void 0, void 0, void 0, function* () {
    const QuizImage = yield quizImage_model_1.QuizImageModel.findById(QuizImageId);
    if (!QuizImage) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "QuizImage Not Found!");
    }
    return QuizImage;
});
const getQuizImageMetaById = (QuizImageId) => __awaiter(void 0, void 0, void 0, function* () {
    const QuizImage = yield quizImage_model_1.QuizImageModel.findById(QuizImageId);
    if (!QuizImage) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "QuizImage Not Found!");
    }
    const argumentFound = yield arguments_model_1.ArgumentsModel.find({
        image: QuizImageId,
    }).select("title");
    const argTopicFound = yield argTopics_model_1.ArgTopicsModel.find({
        image: QuizImageId,
    }).select("title");
    const argTopicTheory = yield argTopics_model_1.ArgTopicsModel.find({
        theoryImages: QuizImageId,
    }).select("title");
    const quizFound = yield topicQuizzes_model_1.TopicQuizModel.find({
        image: QuizImageId,
    }).select("question");
    return {
        argumentFound,
        argTopicFound,
        argTopicTheory,
        quizFound,
    };
});
const getQuizImagesQueryFromDb = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const QuizImagesQuery = new QueryBuilder_1.default(quizImage_model_1.QuizImageModel.find(), query)
        .search(["figure"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield QuizImagesQuery.modelQuery;
    const meta = yield QuizImagesQuery.countTotal();
    return {
        meta,
        result,
    };
});
const deleteQuizImageFromDB = (QuizImageId) => __awaiter(void 0, void 0, void 0, function* () {
    const QuizImage = yield quizImage_model_1.QuizImageModel.findById(QuizImageId);
    if (!QuizImage) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "QuizImage Not Found!");
    }
    const deleted = yield quizImage_model_1.QuizImageModel.findByIdAndDelete(QuizImageId);
    const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, QuizImage.imageUrl);
    yield (0, s3_1.deleteS3Object)(objectKey);
    return deleted;
});
// --------------- App -- aggregate method -- more OW
const getQuizImagesQueryFromDbinApp = (query) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield quizImage_model_1.QuizImageModel.aggregate(aggregateCondition);
    // if getIds query performed and need to return only ids
    if (query.getIds) {
        return result.length > 0 ? result[0].ids : [];
    }
    // or else return the whole result
    return result;
});
exports.QuizImageServices = {
    createQuizImageIntoDB,
    updateQuizImageIntoDB,
    getQuizImagesQueryFromDb,
    getSingleQuizImageByIdFromDb,
    deleteQuizImageFromDB,
    getQuizImagesQueryFromDbinApp,
    getQuizImageMetaById,
};
