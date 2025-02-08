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
exports.UniContentControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const UniContent_service_1 = require("./UniContent.service");
// -------- UniContent
const createUniContent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield UniContent_service_1.UniContentServices.createUniContent(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "UniContent created Successfully!",
        data: result,
    });
}));
const getAllUniContentByQuery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield UniContent_service_1.UniContentServices.getAllUniContentByQuery(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "UniContent retrive Successfully!",
        data: result,
    });
}));
const deleteUniContent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield UniContent_service_1.UniContentServices.deleteUniContent(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "UniContent deleted Successfully!",
        data: result,
    });
}));
const updateContent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield UniContent_service_1.UniContentServices.updateUniContentIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Content updated Successfully!",
        data: updated,
    });
}));
exports.UniContentControllers = {
    createUniContent,
    getAllUniContentByQuery,
    deleteUniContent,
    updateContent,
};
