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
exports.WordsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const words_model_1 = require("./words.model");
const https_1 = __importDefault(require("https"));
// translate create word
const translateCreateWord = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (payload.sourceLang !== "it" || payload.translatedLang !== "bn") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "For now only Italian to Bangla translation is supported");
    }
    // Check if the word already exists
    const existingWord = yield words_model_1.WordsModel.findOne({
        sourceWords: payload.sourceWords,
        sourceLang: payload.sourceLang,
        translatedLang: payload.translatedLang,
    });
    if (existingWord) {
        return existingWord;
    }
    if (payload.sourceWords && payload.sourceLang && payload.translatedLang) {
        const options = {
            method: "POST",
            hostname: "deep-translate1.p.rapidapi.com",
            path: "/language/translate/v2",
            headers: {
                "x-rapidapi-key": "32ac7b8134mshefbf35d78a8c3d7p109611jsn074ba77adde0",
                "x-rapidapi-host": "deep-translate1.p.rapidapi.com",
                "Content-Type": "application/json",
            },
        };
        try {
            const translated = yield new Promise((resolve, reject) => {
                const translationReq = https_1.default.request(options, apiRes => {
                    let data = "";
                    apiRes.on("data", (chunk) => {
                        data += chunk;
                    });
                    apiRes.on("end", () => {
                        try {
                            const response = JSON.parse(data);
                            resolve(response);
                        }
                        catch (error) {
                            reject(new AppError_1.default(http_status_1.default.BAD_GATEWAY, "Failed to parse translation response"));
                        }
                    });
                });
                // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, no-unused-vars
                translationReq.on("error", (err) => {
                    reject(new AppError_1.default(http_status_1.default.BAD_GATEWAY, "Failed to connect to the translation service"));
                });
                translationReq.write(JSON.stringify({
                    q: payload.sourceWords,
                    source: payload.sourceLang,
                    target: payload.translatedLang,
                }));
                translationReq.end();
            });
            // console.log({translated:translated.data.translations.translatedText});
            // Save the new word to the database
            if ((_b = (_a = translated === null || translated === void 0 ? void 0 : translated.data) === null || _a === void 0 ? void 0 : _a.translations) === null || _b === void 0 ? void 0 : _b.translatedText) {
                const createdWord = yield words_model_1.WordsModel.create({
                    sourceWords: payload.sourceWords,
                    sourceLang: payload.sourceLang,
                    translated: translated.data.translations.translatedText,
                    translatedLang: payload.translatedLang,
                });
                return createdWord;
            }
            else {
                throw new Error("Failed to translate the word 1");
            }
        }
        catch (error) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, error.message);
        }
        // return createdWord;
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide all the required fields: sourceWords, sourceLang, and translatedLang are required.");
    }
});
// create word
const createWord = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const exitsWord = yield words_model_1.WordsModel.findOne({ word: payload.sourceWords });
    //   if already exits
    if (exitsWord) {
        return exitsWord;
    }
    //   if not exits and need to create the need to check the required fields
    if (payload.sourceWords &&
        payload.sourceLang &&
        payload.translated &&
        payload.translatedLang) {
        return yield words_model_1.WordsModel.create(payload);
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide all the required fields");
    }
});
exports.WordsService = {
    createWord,
    translateCreateWord,
};
