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
exports.wordsControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const words_service_1 = require("./words.service");
// create word
// const createdWord = catchAsync(async (req, res) => {
//   const wordData = req.body;
//   const createdWord = await WordsService.createWord(wordData);
//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: "Translated Data retrive!",
//     data: createdWord,
//   });
// });
//translate create word
const translateCreateWord = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wordData = req.body;
    const createdWord = yield words_service_1.WordsService.translateCreateWord(wordData);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Translated Data retrive!",
        data: createdWord,
    });
}));
exports.wordsControllers = {
    // createdWord,
    translateCreateWord,
};
