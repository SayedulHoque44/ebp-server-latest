import { model, Schema } from "mongoose";
import { TWords } from "./words.interface";

const wordsSchema = new Schema<TWords>(
  {
    sourceWords: {
      type: String,
      required: true,
      unique: true,
    },
    sourceLang: {
      type: String,
      required: true,
    },
    translated: {
      type: String,
      required: true,
    },
    translatedLang: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const WordsModel = model<TWords>("TranslationWords", wordsSchema);
