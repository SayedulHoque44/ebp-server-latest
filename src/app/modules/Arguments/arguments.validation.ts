import { z } from "zod";

// create argument
const createArgumentSchema = z.object({
  body: z.object({
    title: z.string(),
    image: z.string().optional(),
  }),
});
// create argument
const updateArgumentSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    image: z.string().optional(),
  }),
});

//
export const argumentsValidation = {
  createArgumentSchema,
  updateArgumentSchema,
};
