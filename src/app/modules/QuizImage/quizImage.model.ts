import { Schema, model } from "mongoose";
import { TQuizImage } from "./quizImage.interface";

const quizImageSchema = new Schema<TQuizImage>(
  {
    figure: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

//
export const QuizImageModel = model<TQuizImage>("QuizImage", quizImageSchema);
