import { z } from "zod";

//register user
const createQNAPdf = z.object({
  body: z.object({
    title: z.string(),
    link: z.string(),
  }),
});

export const QNAPdfValidation = { createQNAPdf };
