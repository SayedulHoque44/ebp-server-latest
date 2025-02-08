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
exports.ArgTopicServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const argTopics_model_1 = require("./argTopics.model");
const quizImage_model_1 = require("../QuizImage/quizImage.model");
const arguments_model_1 = require("../Arguments/arguments.model");
const queryUpdatedAtRange_1 = __importDefault(require("../../utils/queryUpdatedAtRange"));
const mongoose_1 = __importDefault(require("mongoose"));
const topicQuizzes_model_1 = require("../TopicQuizzes/topicQuizzes.model");
const createArgTopicIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check argument id exits
    const argument = yield arguments_model_1.ArgumentsModel.findById(payload.argumentId);
    if (!argument) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Argument not found!");
    }
    // check image id exits
    if (payload === null || payload === void 0 ? void 0 : payload.image) {
        const image = yield quizImage_model_1.QuizImageModel.findById(payload.image);
        if (!image) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "image not found!");
        }
    }
    //check theroy image exits
    if (payload.theoryImages && payload.theoryImages.length > 0) {
        const isTheoryImagesExits = yield quizImage_model_1.QuizImageModel.find({
            _id: {
                $in: payload.theoryImages,
            },
        });
        if (isTheoryImagesExits.length !== payload.theoryImages.length) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Given Theory Images not found!");
        }
    }
    const createArgTopic = yield argTopics_model_1.ArgTopicsModel.create(payload);
    return createArgTopic;
});
const updateArgTopicIntoDB = (argTopicId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // stop to direct changes in theoryImages field
    // if (payload?.theoryImages) {
    //   throw new AppError(
    //     httpStatus.BAD_REQUEST,
    //     "You Cannot Updated theory images directly!",
    //   );
    // }
    // check updating argumentId exits
    if (payload === null || payload === void 0 ? void 0 : payload.argumentId) {
        const argument = yield arguments_model_1.ArgumentsModel.findById(payload.argumentId);
        if (!argument) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Argument not found!");
        }
    }
    // check updating image exits
    if (payload === null || payload === void 0 ? void 0 : payload.image) {
        const image = yield quizImage_model_1.QuizImageModel.findById(payload.image);
        if (!image) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "image not found!");
        }
    }
    // is argTopic exits
    const argTopic = yield argTopics_model_1.ArgTopicsModel.findById(argTopicId);
    if (!argTopic) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Argument Topic Not Found!");
    }
    const updatedArgTopic = yield argTopics_model_1.ArgTopicsModel.findByIdAndUpdate(argTopicId, payload, {
        new: true,
    });
    return updatedArgTopic;
});
const getSingleArgTopicByIdFromDb = (argTopicId) => __awaiter(void 0, void 0, void 0, function* () {
    const argTopic = yield argTopics_model_1.ArgTopicsModel.findById(argTopicId).populate("theoryImages");
    if (!argTopic) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Argument Topic Not Found!");
    }
    return argTopic;
});
const getArgTopicsQueryFromDb = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const argTopicsQuery = new QueryBuilder_1.default(argTopics_model_1.ArgTopicsModel.find(), query)
        .search(["title", "theory"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield argTopicsQuery.modelQuery.populate("image theoryImages argumentId");
    const meta = yield argTopicsQuery.countTotal();
    return {
        meta,
        result,
    };
});
const deleteArgTopicFromDB = (argTopicId) => __awaiter(void 0, void 0, void 0, function* () {
    const argTopic = yield argTopics_model_1.ArgTopicsModel.findById(argTopicId);
    if (!argTopic) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Argument Topic Not Found!");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // delete argument
        const deletedArgTopic = yield argTopics_model_1.ArgTopicsModel.findByIdAndUpdate(argTopicId, { isDeleted: true }, {
            session,
        });
        if (!deletedArgTopic) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Faild to delete!");
        }
        // delete related quizzes
        const deleteTopicQuizzes = yield topicQuizzes_model_1.TopicQuizModel.updateMany({
            ArgTopicId: argTopicId,
        }, {
            isDeleted: true,
        }, { session });
        if (!deleteTopicQuizzes) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Faild to delete!");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return null;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to delete Topic!");
    }
});
//
const addTheroyImagesInArgTopic = (argTopicId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.theoryImages.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Request theroy images cannot be empty!");
    }
    const argTopic = yield argTopics_model_1.ArgTopicsModel.findById(argTopicId);
    if (!argTopic) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Argument Topic Not Found!");
    }
    //check theroy image exits
    const isTheoryImagesExits = yield quizImage_model_1.QuizImageModel.find({
        _id: {
            $in: payload.theoryImages,
        },
    });
    if (isTheoryImagesExits.length !== payload.theoryImages.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Given Theory Images not found!");
    }
    const updated = yield argTopics_model_1.ArgTopicsModel.findByIdAndUpdate(argTopicId, {
        $addToSet: {
            theoryImages: {
                $each: payload.theoryImages,
            },
        },
    }, {
        new: true,
    });
    return updated;
});
//
const deleteTheroyImagesFromArgTopic = (argTopicId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.theoryImages.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Request theroy images cannot be empty!");
    }
    const argTopic = yield argTopics_model_1.ArgTopicsModel.findById(argTopicId);
    if (!argTopic) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Argument Topic Not Found!");
    }
    const updated = yield argTopics_model_1.ArgTopicsModel.findByIdAndUpdate(argTopicId, {
        $pull: {
            theoryImages: {
                $in: payload.theoryImages,
            },
        },
    }, {
        new: true,
    });
    return updated;
});
// --------------- App
const getArgTopicsQueryFromDbinApp = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // aggregation initial Array
    const aggregateCondition = [];
    const aggregationMatch = { $match: {} };
    // updatedAt query match for aggreagation
    const updateAtRangeMatch = (0, queryUpdatedAtRange_1.default)(query);
    // enter match updatedAtRange condition
    if (query.updatedAtGte || query.updatedAtLte) {
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
    const result = yield argTopics_model_1.ArgTopicsModel.aggregate(aggregateCondition);
    // if getIds query performed and need to return only ids
    if (query.getIds) {
        return result.length > 0 ? result[0].ids : [];
    }
    // or else return the whole result
    return result;
});
exports.ArgTopicServices = {
    createArgTopicIntoDB,
    updateArgTopicIntoDB,
    getArgTopicsQueryFromDb,
    getSingleArgTopicByIdFromDb,
    deleteArgTopicFromDB,
    addTheroyImagesInArgTopic,
    deleteTheroyImagesFromArgTopic,
    getArgTopicsQueryFromDbinApp,
};
