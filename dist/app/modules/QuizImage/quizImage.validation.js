"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizImagesValidation = void 0;
const zod_1 = require("zod");
// create QuizImage
const createQuizImageSchema = zod_1.z.object({
    body: zod_1.z.object({
        figure: zod_1.z.string(),
        imageUrl: zod_1.z.string().optional(),
    }),
});
// create QuizImage
const updateQuizImageSchema = zod_1.z.object({
    body: zod_1.z.object({
        figure: zod_1.z.string().optional(),
        imageUrl: zod_1.z.string().optional(),
    }),
});
//
exports.QuizImagesValidation = {
    createQuizImageSchema,
    updateQuizImageSchema,
};
