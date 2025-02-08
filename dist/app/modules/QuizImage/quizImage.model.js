"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizImageModel = void 0;
const mongoose_1 = require("mongoose");
const quizImageSchema = new mongoose_1.Schema({
    figure: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
//
exports.QuizImageModel = (0, mongoose_1.model)("QuizImage", quizImageSchema);
