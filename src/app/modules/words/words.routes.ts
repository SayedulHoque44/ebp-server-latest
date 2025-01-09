import express from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { wordsValidationSchema } from "./words.validation";
import { wordsControllers } from "./words.controllers";

const router = express.Router();

// router.post(
//   "/create",
//   validateRequest(wordsValidationSchema.createWord),
//   wordsControllers.createdWord,
// );
router.post(
  "/translate/create",
  validateRequest(wordsValidationSchema.createWord),
  wordsControllers.translateCreateWord,
);

export const wordsRoutes = router;
