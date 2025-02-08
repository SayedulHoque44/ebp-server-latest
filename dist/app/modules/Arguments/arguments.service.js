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
exports.ArgumentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const arguments_model_1 = require("./arguments.model");
const quizImage_model_1 = require("../QuizImage/quizImage.model");
const mongoose_1 = __importDefault(require("mongoose"));
const argTopics_model_1 = require("../ArgTopics/argTopics.model");
const topicQuizzes_model_1 = require("../TopicQuizzes/topicQuizzes.model");
const queryUpdatedAtRange_1 = __importDefault(require("../../utils/queryUpdatedAtRange"));
const createArgumentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //check image id is exits
    if (payload.image) {
        const image = yield quizImage_model_1.QuizImageModel.findById(payload.image);
        if (!image) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Image not found");
        }
    }
    // check if u try to a enter figure name which is alreay exits
    const exitsSameArgu = yield arguments_model_1.ArgumentsModel.findOne({
        title: payload.title,
    });
    if (exitsSameArgu) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Argument Name Already Exits!");
    }
    const createArg = yield arguments_model_1.ArgumentsModel.create(payload);
    return createArg;
});
const updateArgumentIntoDB = (argId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const argument = yield arguments_model_1.ArgumentsModel.findById(argId);
    if (!argument) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Argument Not Found!");
    }
    // check if u try to a enter title name which is alreay exits
    if (payload === null || payload === void 0 ? void 0 : payload.title) {
        const exitsSameFigure = yield arguments_model_1.ArgumentsModel.findOne({
            _id: {
                $ne: argId,
            },
            title: payload.title,
        });
        if (exitsSameFigure) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Argument Name Already Exits!");
        }
    }
    const updatedArg = yield arguments_model_1.ArgumentsModel.findByIdAndUpdate(argId, payload, {
        new: true,
    });
    return updatedArg;
});
const getSingleArgumentByIdFromDb = (argId) => __awaiter(void 0, void 0, void 0, function* () {
    const singleArg = yield arguments_model_1.ArgumentsModel.findById(argId).populate("image");
    if (!singleArg) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Argument Not Found!");
    }
    // const totalQuizzes = await TopicQuizModel.countDocuments({
    //   argumentId: singleArg._id,
    // });
    // return {
    //   singleArg,
    //   totalQuizzes,
    // };
    return singleArg;
});
const getArgumentsQueryFromDb = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const countWQuery = query.count ? query.count : false;
    delete query.count;
    const argumentsQuery = new QueryBuilder_1.default(arguments_model_1.ArgumentsModel.find(), query)
        .search(["title"])
        .filter()
        .sort()
        .paginate()
        .fields();
    let result = yield argumentsQuery.modelQuery.populate("image");
    const meta = yield argumentsQuery.countTotal();
    if (countWQuery) {
        result = yield Promise.all(result.map((arg) => __awaiter(void 0, void 0, void 0, function* () {
            const totalQuizzes = yield topicQuizzes_model_1.TopicQuizModel.countDocuments({
                argumentId: arg._id,
            });
            return Object.assign(Object.assign({}, arg.toObject()), { totalQuizzes });
        })));
    }
    return {
        meta,
        result,
    };
});
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
const getArgumentsQueryFromDbinApp = (query) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield arguments_model_1.ArgumentsModel.aggregate(aggregateCondition);
    // if getIds query performed and need to return only ids
    if (query.getIds) {
        return result.length > 0 ? result[0].ids : [];
    }
    // or else return the whole result
    return result;
});
const deleteArgumentFromDB = (argId) => __awaiter(void 0, void 0, void 0, function* () {
    const argument = yield arguments_model_1.ArgumentsModel.findById(argId);
    if (!argument) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Argument Not Found!");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // delete argument
        const deletedArgument = yield arguments_model_1.ArgumentsModel.findByIdAndUpdate(argId, {
            isDeleted: true,
        }, {
            session,
        });
        if (!deletedArgument) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Faild to delete!");
        }
        // delete related topic
        const deleteArgTopics = yield argTopics_model_1.ArgTopicsModel.updateMany({
            argumentId: argId,
        }, {
            isDeleted: true,
        }, { session });
        if (!deleteArgTopics) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Faild to delete!");
        }
        // delete related quizzes
        const deleteTopicQuizzes = yield topicQuizzes_model_1.TopicQuizModel.updateMany({
            argumentId: argId,
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
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to delete argument!");
    }
});
exports.ArgumentServices = {
    createArgumentIntoDB,
    updateArgumentIntoDB,
    getArgumentsQueryFromDb,
    getSingleArgumentByIdFromDb,
    deleteArgumentFromDB,
    getArgumentsQueryFromDbinApp,
};
