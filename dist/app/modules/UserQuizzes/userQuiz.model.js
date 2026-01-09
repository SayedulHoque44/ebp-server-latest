"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQuizModel = void 0;
const mongoose_1 = require("mongoose");
const userQuizSchema = new mongoose_1.Schema({
    quizId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TopicQuizze",
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    givenAnswer: {
        type: String,
        enum: ["V", "F"],
        required: true,
    },
    isCorrect: {
        type: Boolean,
        required: true,
    },
    playedCount: {
        type: Number,
        default: 1,
    },
}, {
    timestamps: true,
    // Set up automatic deletion (TTL) after 1 month (30 days)
    // MongoDB TTL in seconds: 30 days * 24 hours * 60 minutes * 60 seconds = 2,592,000
    // The TTL will apply to the 'createdAt' field provided by timestamps
    expireAfterSeconds: 2592000,
});
exports.UserQuizModel = (0, mongoose_1.model)("UserQuiz", userQuizSchema);
