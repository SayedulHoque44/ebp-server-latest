"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubContentValidationSchemas = void 0;
const zod_1 = require("zod");
const createSubContent = zod_1.z.object({
    body: zod_1.z.object({
        RefId: zod_1.z.string({ required_error: "Refference Id Required!" }),
        title: zod_1.z.string().optional(),
        info: zod_1.z.string().optional(),
        imageUrl: zod_1.z.string().optional(),
        url: zod_1.z.string().optional(),
        youtubeUrl: zod_1.z.string().optional(),
    }),
});
exports.SubContentValidationSchemas = { createSubContent };
