"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const words_validation_1 = require("./words.validation");
const words_controllers_1 = require("./words.controllers");
const router = express_1.default.Router();
// router.post(
//   "/create",
//   validateRequest(wordsValidationSchema.createWord),
//   wordsControllers.createdWord,
// );
router.post("/translate/create", (0, validateRequest_1.default)(words_validation_1.wordsValidationSchema.createWord), words_controllers_1.wordsControllers.translateCreateWord);
exports.wordsRoutes = router;
