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
exports.userQuizService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../error/AppError"));
const topicQuizzes_model_1 = require("../TopicQuizzes/topicQuizzes.model");
const userQuiz_model_1 = require("./userQuiz.model");
const user_model_1 = require("../User/user.model");
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const createUserQuizIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Early validation: check if payload is empty
    if (!payload || payload.length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Payload cannot be empty!");
    }
    const userId = payload[0].userId;
    // Step 1: Check user exists (single query)
    const user = yield user_model_1.userModel.findById(userId).lean();
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User Not Found!");
    }
    // Step 2: Batch check all quizzes exist at once (single query)
    const quizIds = [...new Set(payload.map(quiz => quiz.quizId))];
    const existingQuizzes = yield topicQuizzes_model_1.TopicQuizModel.find({
        _id: { $in: quizIds },
    })
        .select("_id")
        .lean();
    const existingQuizIds = new Set(existingQuizzes.map(quiz => quiz._id.toString()));
    // Filter out invalid quizzes
    const validPayload = payload.filter(quiz => existingQuizIds.has(quiz.quizId.toString()));
    if (validPayload.length === 0) {
        return { user, quizzesAdded: 0 };
    }
    // Step 3: Batch check all existing user quizzes at once (single query)
    const existingUserQuizIds = validPayload.map(quiz => quiz.quizId);
    const existingUserQuizzes = yield userQuiz_model_1.UserQuizModel.find({
        userId,
        quizId: { $in: existingUserQuizIds },
    }).lean();
    // Create a map for quick lookup: quizId -> existingUserQuiz
    const existingUserQuizMap = new Map(existingUserQuizzes.map(quiz => [quiz.quizId.toString(), quiz]));
    // Step 4: Prepare bulk operations (updates and inserts)
    const bulkOps = validPayload.map(madeQuiz => {
        const existingUserQuiz = existingUserQuizMap.get(madeQuiz.quizId.toString());
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
        }
        else {
            // Insert new quiz
            return {
                insertOne: {
                    document: Object.assign(Object.assign({}, madeQuiz), { playedCount: madeQuiz.playedCount || 1 }),
                },
            };
        }
    });
    // Step 5: Execute all operations in a single bulk write (much faster!)
    if (bulkOps.length > 0) {
        yield userQuiz_model_1.UserQuizModel.bulkWrite(bulkOps, { ordered: false });
    }
    return { user, quizzesAdded: validPayload.length };
});
const getUserQuizByQuery = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User ID is required!");
    }
    // Convert string boolean to actual boolean for isCorrect
    if (query.isCorrect !== undefined) {
        query.isCorrect = query.isCorrect === "true" || query.isCorrect === true;
    }
    query.userId = userId;
    // console.log(query);
    const userQuiz = new QueryBuilder_1.default(userQuiz_model_1.UserQuizModel.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield userQuiz.modelQuery.populate("quizId");
    const meta = yield userQuiz.countTotal();
    return {
        meta,
        result,
    };
});
const getRandomPlayedQuizzesFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Get unique quizIds from incorrect UserQuizzes
    const quizIdsResult = yield userQuiz_model_1.UserQuizModel.aggregate([
        {
            $match: {
                isCorrect: false,
                userId: new mongoose_1.Types.ObjectId(userId),
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
    const topicQuizzes = yield topicQuizzes_model_1.TopicQuizModel.aggregate([
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
});
const geSingletUserQuizStatisticsFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const totalQuizzes = yield topicQuizzes_model_1.TopicQuizModel.countDocuments();
    const totalCorrectQuizzes = yield userQuiz_model_1.UserQuizModel.countDocuments({
        userId,
        isCorrect: true,
    });
    const totalinCorrectQuizzes = yield userQuiz_model_1.UserQuizModel.countDocuments({
        userId,
        isCorrect: false,
    });
    // Calculate total sum of playedCount for all quizzes played by this user
    const quizPlayedTotalCountResult = yield userQuiz_model_1.UserQuizModel.aggregate([
        {
            $match: {
                userId: new mongoose_1.Types.ObjectId(userId),
            },
        },
        {
            $group: {
                _id: null,
                totalPlayedCount: { $sum: "$playedCount" },
            },
        },
    ]);
    const totalPlayedCount = quizPlayedTotalCountResult.length > 0
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
});
exports.userQuizService = {
    createUserQuizIntoDB,
    getUserQuizByQuery,
    getRandomPlayedQuizzesFromDB,
    geSingletUserQuizStatisticsFromDB,
};
