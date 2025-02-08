"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.argTopicRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const argTopics_controller_1 = require("./argTopics.controller");
const argTopics_validation_1 = require("./argTopics.validation");
const router = express_1.default.Router();
// routes
// create
router.post("/", (0, validateRequest_1.default)(argTopics_validation_1.argTopicValidation.createArgTopicSchema), argTopics_controller_1.ArgTopicControllers.createArgTopic);
// get all
router.get("/", argTopics_controller_1.ArgTopicControllers.getArgTopicsByQuery);
// single get
router.get("/:argTopicId", argTopics_controller_1.ArgTopicControllers.getSingleArgTopicById);
// update
router.patch("/:argTopicId", (0, validateRequest_1.default)(argTopics_validation_1.argTopicValidation.updateArgTopicSchema), argTopics_controller_1.ArgTopicControllers.updateArgTopic);
// delete
router.delete("/:argTopicId", argTopics_controller_1.ArgTopicControllers.deleteArgTopic);
// update theoryimages
router.patch("/:argTopicId/theoryImages", (0, validateRequest_1.default)(argTopics_validation_1.argTopicValidation.updateArgTopicTheroyImagesSchema), argTopics_controller_1.ArgTopicControllers.addTheroyImagesInArgTopic);
// delete theoryimages
router.delete("/:argTopicId/theoryImages", (0, validateRequest_1.default)(argTopics_validation_1.argTopicValidation.updateArgTopicTheroyImagesSchema), argTopics_controller_1.ArgTopicControllers.deleteTheroyImagesFromArgTopic);
// --------------- App
router.get("/app/query", argTopics_controller_1.ArgTopicControllers.getArgTopicsQueryFromDbinApp);
// export route
exports.argTopicRoutes = router;
