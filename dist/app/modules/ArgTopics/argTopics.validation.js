"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.argTopicValidation = void 0;
const zod_1 = require("zod");
// create argument
const createArgTopicSchema = zod_1.z.object({
    body: zod_1.z.object({
        argumentId: zod_1.z.string(),
        title: zod_1.z.string(),
        theory: zod_1.z.string(),
        videoUrl: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        theoryImages: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
// create argument
const updateArgTopicSchema = zod_1.z.object({
    body: zod_1.z.object({
        argumentId: zod_1.z.string().optional(),
        title: zod_1.z.string().optional(),
        theory: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        videoUrl: zod_1.z.string().optional(),
    }),
});
// create argument
const updateArgTopicTheroyImagesSchema = zod_1.z.object({
    body: zod_1.z.object({
        theoryImages: zod_1.z.array(zod_1.z.string()),
    }),
});
//
exports.argTopicValidation = {
    createArgTopicSchema,
    updateArgTopicSchema,
    updateArgTopicTheroyImagesSchema,
};
