import express from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { QuizImageControllers } from "./quizImage.controllers";
import { QuizImagesValidation } from "./quizImage.validation";

const router = express.Router();

// routes
// create
router.post(
  "/",
  validateRequest(QuizImagesValidation.createQuizImageSchema),
  QuizImageControllers.createQuizImage,
);
// get all
router.get("/", QuizImageControllers.getQuizImagesByQuery);
// single get
router.get("/:QuizImageId", QuizImageControllers.getSingleQuizImageById);
// get imge relation
router.get(
  "/image-meta/:QuizImageId",
  QuizImageControllers.getQuizImageMetaById,
);
// update
router.patch(
  "/:QuizImageId",
  validateRequest(QuizImagesValidation.updateQuizImageSchema),
  QuizImageControllers.updateQuizImage,
);
// delete
router.delete("/:QuizImageId", QuizImageControllers.deleteQuizImage);

// --------------- App
router.get("/app/query", QuizImageControllers.getQuizImagesQueryFromDbinApp);
// export route
export const QuizImagesRoutes = router;
