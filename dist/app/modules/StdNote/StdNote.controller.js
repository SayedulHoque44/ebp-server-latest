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
exports.trucchiControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const StdNote_service_1 = require("./StdNote.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// -------- Trucchi
const createTrucchi = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield StdNote_service_1.trucchiServices.createTrucchi(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Trucchi created Successfully!",
        data: result,
    });
}));
const getAllTrucchiByQuery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield StdNote_service_1.trucchiServices.getAllTrucchiByQuery(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Trucchi retrive Successfully!",
        data: result,
    });
}));
const deleteTrucchi = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield StdNote_service_1.trucchiServices.deleteTrucchi(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Trucchi deleted Successfully!",
        data: result,
    });
}));
// -------- Trucchi Images
const createTrucchiImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield StdNote_service_1.trucchiServices.createTrucchiImage(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Trucchi Image created Successfully!",
        data: result,
    });
}));
const getAllTrucchiImagesByTrucchiId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield StdNote_service_1.trucchiServices.getAllTrucchiImagesByTrucchiId(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Trucchi Images retrive Successfully!",
        data: result,
    });
}));
const deleteTrucchiImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield StdNote_service_1.trucchiServices.deleteTrucchiImage(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Trucchi Image deleted Successfully!",
        data: result,
    });
}));
exports.trucchiControllers = {
    createTrucchi,
    getAllTrucchiByQuery,
    deleteTrucchi,
    createTrucchiImage,
    getAllTrucchiImagesByTrucchiId,
    deleteTrucchiImage,
};
