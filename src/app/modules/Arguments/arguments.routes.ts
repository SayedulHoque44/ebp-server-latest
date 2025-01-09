import express from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { ArgumentControllers } from "./arguments.controller";
import { argumentsValidation } from "./arguments.validation";

const router = express.Router();

// routes
// create
router.post(
  "/",
  validateRequest(argumentsValidation.createArgumentSchema),
  ArgumentControllers.createArgument,
);
// get all
router.get("/", ArgumentControllers.getArgumentsByQuery);
// single get
router.get("/:argId", ArgumentControllers.getSingleArgumentById);
// update
router.patch(
  "/:argId",
  validateRequest(argumentsValidation.updateArgumentSchema),
  ArgumentControllers.updateArgument,
);
// delete
router.delete("/:argId", ArgumentControllers.deleteArgument);

// --------------- App
router.get("/app/query", ArgumentControllers.getArgumentsByQueryInApp);

// export route
export const argumentsRoutes = router;
