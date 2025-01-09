import { z } from "zod";

// create argument
const createArgumentSchema = z.object({
  body: z.object({
    argumentId: z.string(),
    ArgTopicId: z.string(),
    question: z.string(),
    answer: z.enum(["V", "F"]),
    image: z.string().optional(),
    authorAudio: z.string().optional(),
  }),
});
// create argument
const updateArgumentSchema = z.object({
  body: z.object({
    argumentId: z.string().optional(),
    ArgTopicId: z.string().optional(),
    question: z.string().optional(),
    answer: z.enum(["V", "F"]).optional(),
    image: z.string().optional(),
    authorAudio: z.string().optional(),
  }),
});

//
export const argumentsValidation = {
  createArgumentSchema,
  updateArgumentSchema,
};
