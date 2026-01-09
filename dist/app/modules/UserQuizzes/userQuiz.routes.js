"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQuizzesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const userQuiz_validation_1 = require("./userQuiz.validation");
const userQuiz_controller_1 = require("./userQuiz.controller");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/create", (0, validateRequest_1.default)(userQuiz_validation_1.userQuizValidationSchema.createUserQuiz), userQuiz_controller_1.userQuizControllers.createUserQuiz);
router.get("/", (0, auth_1.default)("Admin", "Student"), userQuiz_controller_1.userQuizControllers.getUserQuizByQuery);
router.get("/random-played-quizzes", (0, auth_1.default)("Admin", "Student"), userQuiz_controller_1.userQuizControllers.getRandomPlayedQuizzes);
router.get("/singlet-user-quiz-statistics/:userId", (0, auth_1.default)("Admin", "Student"), userQuiz_controller_1.userQuizControllers.getSingletUserQuizStatistics);
exports.userQuizzesRoutes = router;
