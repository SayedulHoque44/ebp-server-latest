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
exports.userQuizControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const userQuiz_service_1 = require("./userQuiz.service");
// create user quiz
const createUserQuiz = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUserQuiz = yield userQuiz_service_1.userQuizService.createUserQuizIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "User Quiz created Successfully!",
        data: createdUserQuiz,
    });
}));
// get user quiz by userId
const getUserQuizByQuery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuiz = yield userQuiz_service_1.userQuizService.getUserQuizByQuery(req.query, req.user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User Quiz retrive Successfully!",
        data: userQuiz,
    });
}));
// get random played quizzes
const getRandomPlayedQuizzes = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const randomPlayedQuizzes = yield userQuiz_service_1.userQuizService.getRandomPlayedQuizzesFromDB(req.user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Random Played Quizzes retrive Successfully!",
        data: randomPlayedQuizzes,
    });
}));
// get singlet user quiz statistics
const getSingletUserQuizStatistics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const singletUserQuizStatistics = yield userQuiz_service_1.userQuizService.geSingletUserQuizStatisticsFromDB(req.params.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Singlet User Quiz Statistics retrive Successfully!",
        data: singletUserQuizStatistics,
    });
}));
exports.userQuizControllers = {
    createUserQuiz,
    getUserQuizByQuery,
    getRandomPlayedQuizzes,
    getSingletUserQuizStatistics,
};
