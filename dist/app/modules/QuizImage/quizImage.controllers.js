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
exports.QuizImageControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const quizImage_service_1 = require("./quizImage.service");
const createQuizImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdQuizImage = yield quizImage_service_1.QuizImageServices.createQuizImageIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "QuizImage created Successfully!",
        data: createdQuizImage,
    });
}));
const updateQuizImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedQuizImage = yield quizImage_service_1.QuizImageServices.updateQuizImageIntoDB(req.params.QuizImageId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "QuizImage updated Successfully!",
        data: updatedQuizImage,
    });
}));
const getSingleQuizImageById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const QuizImage = yield quizImage_service_1.QuizImageServices.getSingleQuizImageByIdFromDb(req.params.QuizImageId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "QuizImage retrive Successfully!",
        data: QuizImage,
    });
}));
const getQuizImageMetaById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const QuizImage = yield quizImage_service_1.QuizImageServices.getQuizImageMetaById(req.params.QuizImageId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "QuizImage retrive Successfully!",
        data: QuizImage,
    });
}));
const getQuizImagesByQuery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const args = yield quizImage_service_1.QuizImageServices.getQuizImagesQueryFromDb(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "QuizImages are retrive Successfully!",
        data: args,
    });
}));
const deleteQuizImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const arg = yield quizImage_service_1.QuizImageServices.deleteQuizImageFromDB(req.params.QuizImageId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "QuizImage Deleted Successfully!",
        data: null,
    });
}));
// ----------- App
const getQuizImagesQueryFromDbinApp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const args = yield quizImage_service_1.QuizImageServices.getQuizImagesQueryFromDbinApp(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Images are retrive Successfully!",
        data: args,
    });
}));
exports.QuizImageControllers = {
    createQuizImage,
    updateQuizImage,
    getSingleQuizImageById,
    getQuizImagesByQuery,
    deleteQuizImage,
    getQuizImagesQueryFromDbinApp,
    getQuizImageMetaById,
};
