import { z } from "zod";
import { BlogType } from "./Blogs.constant";

const createBlogSchema = z.object({
  body: z.object({
    title: z.string(),
    imageUrl: z.string().optional(),
    description: z.string(),
    type: z.enum(BlogType as [string, ...string[]]),
    tags: z.string(),
    pin: z.boolean(),
  }),
});

const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    imageUrl: z.string().optional(),
    description: z.string().optional(),
    type: z.enum(BlogType as [string, ...string[]]).optional(),
    tags: z.string(),
    pin: z.boolean().optional(),
  }),
});

export const BlogValidation = { createBlogSchema, updateBlogSchema };
