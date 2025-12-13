import express from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { userQuizValidationSchema } from "./userQuiz.validation";
import { userQuizControllers } from "./userQuiz.controller";
import auth from "../../../middlewares/auth";

const router = express.Router();

router.post(
  "/create",
  validateRequest(userQuizValidationSchema.createUserQuiz),
  userQuizControllers.createUserQuiz,
);

router.get(
  "/",
  auth("Admin", "Student"),
  userQuizControllers.getUserQuizByQuery,
);
router.get(
  "/random-played-quizzes",
  auth("Admin", "Student"),
  userQuizControllers.getRandomPlayedQuizzes,
);
router.get(
  "/singlet-user-quiz-statistics/:userId",
  auth("Admin", "Student"),
  userQuizControllers.getSingletUserQuizStatistics,
);
export const userQuizzesRoutes = router;
