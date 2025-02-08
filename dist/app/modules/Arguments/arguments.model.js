"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgumentsModel = void 0;
const mongoose_1 = require("mongoose");
// Schema
const argumentsSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "QuizImage",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// model
exports.ArgumentsModel = (0, mongoose_1.model)("Argument", argumentsSchema);
