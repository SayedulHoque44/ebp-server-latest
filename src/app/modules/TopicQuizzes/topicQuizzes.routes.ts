import express from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { TopicQuizControllers } from "./topicQuizzes.controller";
import { argumentsValidation } from "./topicQuizzes.validation";

const router = express.Router();

// routes
// create
router.post(
  "/",
  validateRequest(argumentsValidation.createArgumentSchema),
  TopicQuizControllers.createTopicQuiz,
);
// get all
router.get("/", TopicQuizControllers.getTopicQuizzesByQuery);
// single get
router.get("/:topicQuizId", TopicQuizControllers.getSingleTopicQuizById);
// update
router.patch(
  "/:topicQuizId",
  validateRequest(argumentsValidation.updateArgumentSchema),
  TopicQuizControllers.updateTopicQuiz,
);
// random topic quizzes
router.post(
  "/random/by-topics-ids",
  TopicQuizControllers.getRandomTopicQuizzesByTopicsIds,
);
// random thirty quizzes - from random arguments with 2 quizzes from first 5 arguments and 1 quiz from remaining 20 arguments
router.get(
  "/random/thirty-quizzes",
  TopicQuizControllers.getRandomThirtyQuizzes,
);
// delete
router.delete("/:topicQuizId", TopicQuizControllers.deleteTopicQuiz);
// --------------- App
router.get("/app/query", TopicQuizControllers.getQuizzesQueryFromDbinApp);
// export route
export const topicQuizzes = router;
