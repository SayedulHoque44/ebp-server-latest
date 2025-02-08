"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicQuizModel = void 0;
const mongoose_1 = require("mongoose");
// Schema
const topicQuizSchema = new mongoose_1.Schema({
    argumentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Argument",
    },
    ArgTopicId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "ArgTopic",
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    image: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "QuizImage",
    },
    authorAudio: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// model
exports.TopicQuizModel = (0, mongoose_1.model)("TopicQuizze", topicQuizSchema);
