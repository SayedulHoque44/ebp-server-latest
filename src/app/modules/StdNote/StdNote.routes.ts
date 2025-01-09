import express from "express";
import { trucchiControllers } from "./StdNote.controller";
import validateRequest from "../../../middlewares/validateRequest";
import { trucchiValidationSchemas } from "./StdNote.validation";

const router = express.Router();

// create trucchi
router.post(
  "/",
  validateRequest(trucchiValidationSchemas.createTrucchi),
  trucchiControllers.createTrucchi,
);
// get all trucchi
router.get("/", trucchiControllers.getAllTrucchiByQuery);
// delete trucchi
router.delete("/:id", trucchiControllers.deleteTrucchi);

// create trucchi
router.post(
  "/image",
  validateRequest(trucchiValidationSchemas.createTrucchiImage),
  trucchiControllers.createTrucchiImage,
);
// get all trucchi
router.get("/image", trucchiControllers.getAllTrucchiImagesByTrucchiId);
// delete trucchi
router.delete("/image/:id", trucchiControllers.deleteTrucchiImage);

export const stdNoteRoutes = router;
