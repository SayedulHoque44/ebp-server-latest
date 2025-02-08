"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniContentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const UniContent_validation_1 = require("./UniContent.validation");
const UniContent_controller_1 = require("./UniContent.controller");
const SubContent_validation_1 = require("../SubContent/SubContent.validation");
const SubContent_controller_1 = require("../SubContent/SubContent.controller");
const router = express_1.default.Router();
// ---------------------------- Uni Content ------------------
// create UniContent
router.post("/", (0, validateRequest_1.default)(UniContent_validation_1.UniContentValidation.createUniContent), UniContent_controller_1.UniContentControllers.createUniContent);
// get all UniContent
router.get("/", UniContent_controller_1.UniContentControllers.getAllUniContentByQuery);
router.get("/contentType", UniContent_controller_1.UniContentControllers.getAllUniContentByQuery);
// delete UniContent
router.delete("/:id", UniContent_controller_1.UniContentControllers.deleteUniContent);
router.patch("/:id", UniContent_controller_1.UniContentControllers.updateContent);
// ----------------------------- SubContent --------------------------
// create SubContent
router.post("/SubContent", (0, validateRequest_1.default)(SubContent_validation_1.SubContentValidationSchemas.createSubContent), SubContent_controller_1.SubContentControllers.createSubContent);
// get all SubContent
router.get("/SubContent", SubContent_controller_1.SubContentControllers.getAllSubContentByQuery);
// delete SubContent
router.delete("/SubContent/:id", SubContent_controller_1.SubContentControllers.deleteSubContent);
router.patch("/SubContent/:id", SubContent_controller_1.SubContentControllers.updateSubContent);
exports.UniContentRoutes = router;
