import express from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { userQuizValidationSchema } from "./userQuiz.validation";
import { userQuizControllers } from "./userQuiz.controller";

const router = express.Router();

router.post(
  "/create",
  validateRequest(userQuizValidationSchema.createUserQuiz),
  userQuizControllers.createUserQuiz,
);

router.get("/", userQuizControllers.getUserQuizByQuery);
router.get(
  "/random-played-quizzes",
  userQuizControllers.getRandomPlayedQuizzes,
);

export const userQuizzesRoutes = router;
