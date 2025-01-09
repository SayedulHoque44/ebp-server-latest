import { z } from "zod";

//register user
const createWord = z.object({
  body: z.object({
    sourceWords: z.string(),
    sourceLang: z.string(),
    translatedLang: z.string(),
    translated: z.string().optional(),
    url: z.string().optional(),
  }),
});

export const wordsValidationSchema = {
  createWord,
};
