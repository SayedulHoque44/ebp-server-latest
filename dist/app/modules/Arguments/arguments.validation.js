"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.argumentsValidation = void 0;
const zod_1 = require("zod");
// create argument
const createArgumentSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string(),
        image: zod_1.z.string().optional(),
    }),
});
// create argument
const updateArgumentSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
    }),
});
//
exports.argumentsValidation = {
    createArgumentSchema,
    updateArgumentSchema,
};
