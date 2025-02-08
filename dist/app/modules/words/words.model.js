"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordsModel = void 0;
const mongoose_1 = require("mongoose");
const wordsSchema = new mongoose_1.Schema({
    sourceWords: {
        type: String,
        required: true,
        unique: true,
    },
    sourceLang: {
        type: String,
        required: true,
    },
    translated: {
        type: String,
        required: true,
    },
    translatedLang: {
        type: String,
        required: true,
    },
    url: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.WordsModel = (0, mongoose_1.model)("TranslationWords", wordsSchema);
