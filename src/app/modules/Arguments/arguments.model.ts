import { Schema, model } from "mongoose";
import { TArgument } from "./arguments.interface";

// Schema
const argumentsSchema = new Schema<TArgument>(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: "QuizImage",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// model
export const ArgumentsModel = model<TArgument>("Argument", argumentsSchema);
