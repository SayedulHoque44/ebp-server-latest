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
exports.SubContentControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const SubContent_service_1 = require("./SubContent.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// -------- SubConten
const createSubContent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield SubContent_service_1.SubContentServices.createSubContent(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "SubContent created Successfully!",
        data: result,
    });
}));
const getAllSubContentByQuery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield SubContent_service_1.SubContentServices.getAllSubContentByQuery(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "SubContent retrive Successfully!",
        data: result,
    });
}));
const deleteSubContent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield SubContent_service_1.SubContentServices.deleteSubContent(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "SubContent deleted Successfully!",
        data: result,
    });
}));
const updateSubContent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield SubContent_service_1.SubContentServices.updateSubContentIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "SubContent updated Successfully!",
        data: updated,
    });
}));
exports.SubContentControllers = {
    createSubContent,
    getAllSubContentByQuery,
    deleteSubContent,
    updateSubContent,
};
