import { z } from "zod";

// create QuizImage
const createQuizImageSchema = z.object({
  body: z.object({
    figure: z.string(),
    imageUrl: z.string().optional(),
  }),
});
// create QuizImage
const updateQuizImageSchema = z.object({
  body: z.object({
    figure: z.string().optional(),
    imageUrl: z.string().optional(),
  }),
});

//
export const QuizImagesValidation = {
  createQuizImageSchema,
  updateQuizImageSchema,
};
