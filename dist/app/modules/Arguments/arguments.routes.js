"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.argumentsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const arguments_controller_1 = require("./arguments.controller");
const arguments_validation_1 = require("./arguments.validation");
const router = express_1.default.Router();
// routes
// create
router.post("/", (0, validateRequest_1.default)(arguments_validation_1.argumentsValidation.createArgumentSchema), arguments_controller_1.ArgumentControllers.createArgument);
// get all
router.get("/", arguments_controller_1.ArgumentControllers.getArgumentsByQuery);
// single get
router.get("/:argId", arguments_controller_1.ArgumentControllers.getSingleArgumentById);
// update
router.patch("/:argId", (0, validateRequest_1.default)(arguments_validation_1.argumentsValidation.updateArgumentSchema), arguments_controller_1.ArgumentControllers.updateArgument);
// delete
router.delete("/:argId", arguments_controller_1.ArgumentControllers.deleteArgument);
// --------------- App
router.get("/app/query", arguments_controller_1.ArgumentControllers.getArgumentsByQueryInApp);
// export route
exports.argumentsRoutes = router;
