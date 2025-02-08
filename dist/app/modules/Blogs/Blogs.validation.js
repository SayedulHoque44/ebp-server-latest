"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogValidation = void 0;
const zod_1 = require("zod");
const Blogs_constant_1 = require("./Blogs.constant");
const createBlogSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string(),
        imageUrl: zod_1.z.string().optional(),
        description: zod_1.z.string(),
        type: zod_1.z.enum(Blogs_constant_1.BlogType),
        tags: zod_1.z.string(),
        pin: zod_1.z.boolean(),
    }),
});
const updateBlogSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        imageUrl: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        type: zod_1.z.enum(Blogs_constant_1.BlogType).optional(),
        tags: zod_1.z.string(),
        pin: zod_1.z.boolean().optional(),
    }),
});
exports.BlogValidation = { createBlogSchema, updateBlogSchema };
