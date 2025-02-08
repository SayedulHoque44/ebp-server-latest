"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniContentValidation = void 0;
const zod_1 = require("zod");
const createUniContent = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Title Required!" }),
        contentType: zod_1.z.string({ required_error: "ContentType Required!" }),
        description: zod_1.z.string().optional(),
        imageUrl: zod_1.z.string().optional(),
    }),
});
exports.UniContentValidation = { createUniContent };
