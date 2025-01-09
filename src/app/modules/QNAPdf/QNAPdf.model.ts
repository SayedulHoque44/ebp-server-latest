import { Schema, model } from "mongoose";
import { TQNAPdf } from "./QNAPdf.interface";

const QNAPdfSchema = new Schema<TQNAPdf>(
  {
    title: String,
    link: String,
  },
  { timestamps: true },
);

export const QNAPdfModel = model<TQNAPdf>("QNAPdf", QNAPdfSchema);
