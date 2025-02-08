"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YTVideoRoutes = void 0;
const express_1 = __importDefault(require("express"));
const YTVideo_controller_1 = require("./YTVideo.controller");
const router = express_1.default.Router();
router.post("/", YTVideo_controller_1.YTVIdeoControllers.createYTVideo);
router.get("/", YTVideo_controller_1.YTVIdeoControllers.getAll);
router.delete("/:id", YTVideo_controller_1.YTVIdeoControllers.deleteVideo);
exports.YTVideoRoutes = router;
