"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QNAPdfRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const QNAPdf_controller_1 = require("./QNAPdf.controller");
const QNAPdf_validation_1 = require("./QNAPdf.validation");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.default)(QNAPdf_validation_1.QNAPdfValidation.createQNAPdf), QNAPdf_controller_1.QNAPdfControllers.createQNAPdf);
router.get("/", QNAPdf_controller_1.QNAPdfControllers.getAllQNAPdf);
router.delete("/:pdfId", QNAPdf_controller_1.QNAPdfControllers.deleteQNAPdf);
//
exports.QNAPdfRoutes = router;
