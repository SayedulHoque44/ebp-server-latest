"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.topicQuizzes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const topicQuizzes_controller_1 = require("./topicQuizzes.controller");
const topicQuizzes_validation_1 = require("./topicQuizzes.validation");
const router = express_1.default.Router();
// routes
// create
router.post("/", (0, validateRequest_1.default)(topicQuizzes_validation_1.argumentsValidation.createArgumentSchema), topicQuizzes_controller_1.TopicQuizControllers.createTopicQuiz);
// get all
router.get("/", topicQuizzes_controller_1.TopicQuizControllers.getTopicQuizzesByQuery);
// single get
router.get("/:topicQuizId", topicQuizzes_controller_1.TopicQuizControllers.getSingleTopicQuizById);
// update
router.patch("/:topicQuizId", (0, validateRequest_1.default)(topicQuizzes_validation_1.argumentsValidation.updateArgumentSchema), topicQuizzes_controller_1.TopicQuizControllers.updateTopicQuiz);
// delete
router.delete("/:topicQuizId", topicQuizzes_controller_1.TopicQuizControllers.deleteTopicQuiz);
// --------------- App
router.get("/app/query", topicQuizzes_controller_1.TopicQuizControllers.getQuizzesQueryFromDbinApp);
// export route
exports.topicQuizzes = router;
