import express from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { ArgTopicControllers } from "./argTopics.controller";
import { argTopicValidation } from "./argTopics.validation";

const router = express.Router();

// routes
// create
router.post(
  "/",
  validateRequest(argTopicValidation.createArgTopicSchema),
  ArgTopicControllers.createArgTopic,
);
// get all
router.get("/", ArgTopicControllers.getArgTopicsByQuery);
// single get
router.get("/:argTopicId", ArgTopicControllers.getSingleArgTopicById);
// update
router.patch(
  "/:argTopicId",
  validateRequest(argTopicValidation.updateArgTopicSchema),
  ArgTopicControllers.updateArgTopic,
);
// delete
router.delete("/:argTopicId", ArgTopicControllers.deleteArgTopic);

// update theoryimages
router.patch(
  "/:argTopicId/theoryImages",
  validateRequest(argTopicValidation.updateArgTopicTheroyImagesSchema),
  ArgTopicControllers.addTheroyImagesInArgTopic,
);
// delete theoryimages
router.delete(
  "/:argTopicId/theoryImages",
  validateRequest(argTopicValidation.updateArgTopicTheroyImagesSchema),
  ArgTopicControllers.deleteTheroyImagesFromArgTopic,
);

// --------------- App
router.get("/app/query", ArgTopicControllers.getArgTopicsQueryFromDbinApp);
// export route
export const argTopicRoutes = router;
