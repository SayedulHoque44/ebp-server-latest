import { Schema, model } from "mongoose";
import { BlogType } from "./Blogs.constant";
import { TBlog } from "./Blogs.interface";

const blogSchema = new Schema<TBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: BlogType,
    },
    tags: String,
    pin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

//
export const BlogModel = model<TBlog>("Blog", blogSchema);
