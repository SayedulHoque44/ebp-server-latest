import { z } from "zod";

const createUniContent = z.object({
  body: z.object({
    title: z.string({ required_error: "Title Required!" }),
    contentType: z.string({ required_error: "ContentType Required!" }),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
  }),
});

export const UniContentValidation = { createUniContent };
