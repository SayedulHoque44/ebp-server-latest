"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgTopicsModel = void 0;
const mongoose_1 = require("mongoose");
// Schema
// const imagesSchema = new Schema<TImages>(
//   {
//     imageId: {
//       type: Schema.Types.ObjectId,
//     },
//     figure: {
//       type: String,
//       required: true,
//     },
//     imageUrl: {
//       type: String,
//       required: true,
//     },
//     pinned: {
//       type: Boolean,
//       default: false,
//     },
//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true },
// );
const argTopicSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    argumentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Argument",
    },
    theory: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
    },
    image: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "QuizImage",
    },
    theoryImages: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "QuizImage",
        },
    ],
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// Add indexes for better query performance
argTopicSchema.index({ argumentId: 1 });
// model
exports.ArgTopicsModel = (0, mongoose_1.model)("ArgTopic", argTopicSchema);
