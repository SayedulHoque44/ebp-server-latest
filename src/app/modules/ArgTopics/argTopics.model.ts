import { Schema, model } from "mongoose";
import { TArgTopic } from "./argTopics.interface";

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
const argTopicSchema = new Schema<TArgTopic>(
  {
    title: {
      type: String,
      required: true,
    },
    argumentId: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: "QuizImage",
    },
    theoryImages: [
      {
        type: Schema.Types.ObjectId,
        ref: "QuizImage",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Add indexes for better query performance
argTopicSchema.index({ argumentId: 1 });

// model
export const ArgTopicsModel = model<TArgTopic>("ArgTopic", argTopicSchema);
