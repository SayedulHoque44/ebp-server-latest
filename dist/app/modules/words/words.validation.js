"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordsValidationSchema = void 0;
const zod_1 = require("zod");
//register user
const createWord = zod_1.z.object({
    body: zod_1.z.object({
        sourceWords: zod_1.z.string(),
        sourceLang: zod_1.z.string(),
        translatedLang: zod_1.z.string(),
        translated: zod_1.z.string().optional(),
        url: zod_1.z.string().optional(),
    }),
});
exports.wordsValidationSchema = {
    createWord,
};
