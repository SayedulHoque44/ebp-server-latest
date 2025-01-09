import { Schema, model } from "mongoose";
import { TUniContent } from "./UniContent.interface";

const UniContentSchema = new Schema<TUniContent>(
  {
    contentType: {
      type: String,
      required: true,
    },
    title: String,
    description: String,
    imageUrl: String,
  },
  { timestamps: true },
);

// model
export const UniContentModel = model<TUniContent>(
  "UniContent",
  UniContentSchema,
);
