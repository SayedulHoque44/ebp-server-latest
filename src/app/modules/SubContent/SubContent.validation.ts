import { z } from "zod";

const createSubContent = z.object({
  body: z.object({
    RefId: z.string({ required_error: "Refference Id Required!" }),
    title: z.string().optional(),
    info: z.string().optional(),
    imageUrl: z.string().optional(),
    url: z.string().optional(),
  }),
});

export const SubContentValidationSchemas = { createSubContent };
