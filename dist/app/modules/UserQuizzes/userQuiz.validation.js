"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQuizValidationSchema = void 0;
const zod_1 = require("zod");
//create user quiz
const createUserQuiz = zod_1.z.object({
    body: zod_1.z.array(zod_1.z.object({
        quizId: zod_1.z.string(),
        userId: zod_1.z.string(),
        givenAnswer: zod_1.z.enum(["V", "F"]),
        isCorrect: zod_1.z.boolean(),
    })),
});
exports.userQuizValidationSchema = {
    createUserQuiz,
};
