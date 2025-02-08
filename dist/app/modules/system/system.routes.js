"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemRoutes = void 0;
const express_1 = __importDefault(require("express"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const system_model_1 = require("./system.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const system_validation_1 = require("./system.validation");
const router = express_1.default.Router();
router.post("/create", (0, validateRequest_1.default)(system_validation_1.systemValidations.createSystem), (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exitsSystem = yield system_model_1.SystemInfoModel.findOne({
        category: req.body.category,
    });
    // if system already exits
    if (exitsSystem) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "System already exits");
    }
    const createdSystem = yield system_model_1.SystemInfoModel.create(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "System created Successfully!",
        data: createdSystem,
    });
})));
router.patch("/:systemId/update", (0, validateRequest_1.default)(system_validation_1.systemValidations.updateSystem), (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exitsSystem = yield system_model_1.SystemInfoModel.findById(req.params.systemId);
    // if system already exits
    if (!exitsSystem) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "System Not Found");
    }
    const updatedSystem = yield system_model_1.SystemInfoModel.findByIdAndUpdate(req.params.systemId, req.body, { new: true, runValidators: true });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "System updated Successfully!",
        data: updatedSystem,
    });
})));
router.delete("/:systemId", (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exitsSystem = yield system_model_1.SystemInfoModel.findById(req.params.systemId);
    // if system already exits
    if (!exitsSystem) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "System Not Found");
    }
    const updatedSystem = yield system_model_1.SystemInfoModel.findByIdAndDelete(req.params.systemId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "System Deleted Successfully!",
        data: updatedSystem,
    });
})));
router.get("/:systemId", (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exitsSystem = yield system_model_1.SystemInfoModel.findById(req.params.systemId);
    // if system already exits
    if (!exitsSystem) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "System Not Found");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "System retrive Successfully!",
        data: exitsSystem,
    });
})));
router.get("/", (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exitsSystem = yield system_model_1.SystemInfoModel.find();
    // if system already exits
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "System retrive Successfully!",
        data: exitsSystem,
    });
})));
exports.systemRoutes = router;
