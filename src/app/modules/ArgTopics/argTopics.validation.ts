import { z } from "zod";

// create argument
const createArgTopicSchema = z.object({
  body: z.object({
    argumentId: z.string(),
    title: z.string(),
    theory: z.string(),
    videoUrl: z.string().optional(),
    image: z.string().optional(),
    theoryImages: z.array(z.string()).optional(),
  }),
});
// create argument
const updateArgTopicSchema = z.object({
  body: z.object({
    argumentId: z.string().optional(),
    title: z.string().optional(),
    theory: z.string().optional(),
    image: z.string().optional(),
    videoUrl: z.string().optional(),
  }),
});
// create argument
const updateArgTopicTheroyImagesSchema = z.object({
  body: z.object({
    theoryImages: z.array(z.string()),
  }),
});

//
export const argTopicValidation = {
  createArgTopicSchema,
  updateArgTopicSchema,
  updateArgTopicTheroyImagesSchema,
};
