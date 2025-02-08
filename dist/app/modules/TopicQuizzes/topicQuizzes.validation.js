"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.argumentsValidation = void 0;
const zod_1 = require("zod");
// create argument
const createArgumentSchema = zod_1.z.object({
    body: zod_1.z.object({
        argumentId: zod_1.z.string(),
        ArgTopicId: zod_1.z.string(),
        question: zod_1.z.string(),
        answer: zod_1.z.enum(["V", "F"]),
        image: zod_1.z.string().optional(),
        authorAudio: zod_1.z.string().optional(),
    }),
});
// create argument
const updateArgumentSchema = zod_1.z.object({
    body: zod_1.z.object({
        argumentId: zod_1.z.string().optional(),
        ArgTopicId: zod_1.z.string().optional(),
        question: zod_1.z.string().optional(),
        answer: zod_1.z.enum(["V", "F"]).optional(),
        image: zod_1.z.string().optional(),
        authorAudio: zod_1.z.string().optional(),
    }),
});
//
exports.argumentsValidation = {
    createArgumentSchema,
    updateArgumentSchema,
};
