import express from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { QNAPdfControllers } from "./QNAPdf.controller";
import { QNAPdfValidation } from "./QNAPdf.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(QNAPdfValidation.createQNAPdf),
  QNAPdfControllers.createQNAPdf,
);

router.get("/", QNAPdfControllers.getAllQNAPdf);

router.delete("/:pdfId", QNAPdfControllers.deleteQNAPdf);

//
export const QNAPdfRoutes = router;
