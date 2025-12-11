import { Schema, model } from "mongoose";
import { TTopicQuiz } from "./topicQuizzes.interface";

// Schema
const topicQuizSchema = new Schema<TTopicQuiz>(
  {
    argumentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Argument",
    },
    ArgTopicId: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: "QuizImage",
    },
    authorAudio: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Add indexes for better query performance
topicQuizSchema.index({ argumentId: 1, isDeleted: 1 });
topicQuizSchema.index({ ArgTopicId: 1, isDeleted: 1 });

// model
export const TopicQuizModel = model<TTopicQuiz>("TopicQuizze", topicQuizSchema);
