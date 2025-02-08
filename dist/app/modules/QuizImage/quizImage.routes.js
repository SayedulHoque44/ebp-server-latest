"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizImagesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const quizImage_controllers_1 = require("./quizImage.controllers");
const quizImage_validation_1 = require("./quizImage.validation");
const router = express_1.default.Router();
// routes
// create
router.post("/", (0, validateRequest_1.default)(quizImage_validation_1.QuizImagesValidation.createQuizImageSchema), quizImage_controllers_1.QuizImageControllers.createQuizImage);
// get all
router.get("/", quizImage_controllers_1.QuizImageControllers.getQuizImagesByQuery);
// single get
router.get("/:QuizImageId", quizImage_controllers_1.QuizImageControllers.getSingleQuizImageById);
// get imge relation
router.get("/image-meta/:QuizImageId", quizImage_controllers_1.QuizImageControllers.getQuizImageMetaById);
// update
router.patch("/:QuizImageId", (0, validateRequest_1.default)(quizImage_validation_1.QuizImagesValidation.updateQuizImageSchema), quizImage_controllers_1.QuizImageControllers.updateQuizImage);
// delete
router.delete("/:QuizImageId", quizImage_controllers_1.QuizImageControllers.deleteQuizImage);
// --------------- App
router.get("/app/query", quizImage_controllers_1.QuizImageControllers.getQuizImagesQueryFromDbinApp);
// export route
exports.QuizImagesRoutes = router;
