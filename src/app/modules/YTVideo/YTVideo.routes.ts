import express from "express";
import { YTVIdeoControllers } from "./YTVideo.controller";

const router = express.Router();

router.post("/", YTVIdeoControllers.createYTVideo);
router.get("/", YTVIdeoControllers.getAll);
router.delete("/:id", YTVIdeoControllers.deleteVideo);

export const YTVideoRoutes = router;
