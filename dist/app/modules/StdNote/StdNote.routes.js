"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stdNoteRoutes = void 0;
const express_1 = __importDefault(require("express"));
const StdNote_controller_1 = require("./StdNote.controller");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const StdNote_validation_1 = require("./StdNote.validation");
const router = express_1.default.Router();
// create trucchi
router.post("/", (0, validateRequest_1.default)(StdNote_validation_1.trucchiValidationSchemas.createTrucchi), StdNote_controller_1.trucchiControllers.createTrucchi);
// get all trucchi
router.get("/", StdNote_controller_1.trucchiControllers.getAllTrucchiByQuery);
// delete trucchi
router.delete("/:id", StdNote_controller_1.trucchiControllers.deleteTrucchi);
// create trucchi
router.post("/image", (0, validateRequest_1.default)(StdNote_validation_1.trucchiValidationSchemas.createTrucchiImage), StdNote_controller_1.trucchiControllers.createTrucchiImage);
// get all trucchi
router.get("/image", StdNote_controller_1.trucchiControllers.getAllTrucchiImagesByTrucchiId);
// delete trucchi
router.delete("/image/:id", StdNote_controller_1.trucchiControllers.deleteTrucchiImage);
exports.stdNoteRoutes = router;
