import express from "express";

import validateRequest from "../../../middlewares/validateRequest";
import { UniContentValidation } from "./UniContent.validation";
import { UniContentControllers } from "./UniContent.controller";
import { SubContentValidationSchemas } from "../SubContent/SubContent.validation";
import { SubContentControllers } from "../SubContent/SubContent.controller";

const router = express.Router();

// ---------------------------- Uni Content ------------------
// create UniContent
router.post(
  "/",
  validateRequest(UniContentValidation.createUniContent),
  UniContentControllers.createUniContent,
);
// get all UniContent
router.get("/", UniContentControllers.getAllUniContentByQuery);
router.get("/contentType", UniContentControllers.getAllUniContentByQuery);
// delete UniContent
router.delete("/:id", UniContentControllers.deleteUniContent);
router.patch("/:id", UniContentControllers.updateContent);

// ----------------------------- SubContent --------------------------
// create SubContent
router.post(
  "/SubContent",
  validateRequest(SubContentValidationSchemas.createSubContent),
  SubContentControllers.createSubContent,
);
// get all SubContent
router.get("/SubContent", SubContentControllers.getAllSubContentByQuery);
// delete SubContent
router.delete("/SubContent/:id", SubContentControllers.deleteSubContent);

router.patch("/SubContent/:id", SubContentControllers.updateSubContent);

export const UniContentRoutes = router;
