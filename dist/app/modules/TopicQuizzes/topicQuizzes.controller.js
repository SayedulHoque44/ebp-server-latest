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
exports.TopicQuizControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const topicQuizzes_service_1 = require("./topicQuizzes.service");
const createTopicQuiz = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdTopicQuiz = yield topicQuizzes_service_1.TopicQuizServices.createTopicQuizIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Quiz created Successfully!",
        data: createdTopicQuiz,
    });
}));
const updateTopicQuiz = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedTopicQuiz = yield topicQuizzes_service_1.TopicQuizServices.updateTopicQuizIntoDB(req.params.topicQuizId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Quiz updated Successfully!",
        data: updatedTopicQuiz,
    });
}));
const getSingleTopicQuizById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const TopicQuiz = yield topicQuizzes_service_1.TopicQuizServices.getSingleTopicQuizByIdFromDb(req.params.topicQuizId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Quiz retrive Successfully!",
        data: TopicQuiz,
    });
}));
const getTopicQuizzesByQuery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const TopicQuizzes = yield topicQuizzes_service_1.TopicQuizServices.getTopicQuizzesQueryFromDb(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Quizzes are retrive Successfully!",
        data: TopicQuizzes,
    });
}));
const deleteTopicQuiz = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const deletedTopicQuiz = yield topicQuizzes_service_1.TopicQuizServices.deleteTopicQuizFromDB(req.params.topicQuizId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Quiz Deleted Successfully!",
        data: null,
    });
}));
// ----------- App
const getQuizzesQueryFromDbinApp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const args = yield topicQuizzes_service_1.TopicQuizServices.getQuizzesQueryFromDbinApp(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Quiz are retrive Successfully!",
        data: args,
    });
}));
exports.TopicQuizControllers = {
    createTopicQuiz,
    updateTopicQuiz,
    getSingleTopicQuizById,
    getTopicQuizzesByQuery,
    deleteTopicQuiz,
    getQuizzesQueryFromDbinApp,
};
