import { z } from "zod";

//create user quiz
const createUserQuiz = z.object({
  body: z.array(
    z.object({
      quizId: z.string(),
      userId: z.string(),
      givenAnswer: z.enum(["V", "F"]),
      isCorrect: z.boolean(),
    }),
  ),
});

export const userQuizValidationSchema = {
  createUserQuiz,
};
