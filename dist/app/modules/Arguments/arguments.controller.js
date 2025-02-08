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
exports.ArgumentControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const arguments_service_1 = require("./arguments.service");
const createArgument = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdArgument = yield arguments_service_1.ArgumentServices.createArgumentIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Argument created Successfully!",
        data: createdArgument,
    });
}));
const updateArgument = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedArgument = yield arguments_service_1.ArgumentServices.updateArgumentIntoDB(req.params.argId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Argument updated Successfully!",
        data: updatedArgument,
    });
}));
const getSingleArgumentById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const argument = yield arguments_service_1.ArgumentServices.getSingleArgumentByIdFromDb(req.params.argId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Argument retrive Successfully!",
        data: argument,
    });
}));
const getArgumentsByQuery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const args = yield arguments_service_1.ArgumentServices.getArgumentsQueryFromDb(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Arguments are retrive Successfully!",
        data: args,
    });
}));
const deleteArgument = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const arg = yield arguments_service_1.ArgumentServices.deleteArgumentFromDB(req.params.argId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Argument Deleted Successfully!",
        data: null,
    });
}));
// ----------- App
const getArgumentsByQueryInApp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const args = yield arguments_service_1.ArgumentServices.getArgumentsQueryFromDbinApp(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Arguments are retrive Successfully!",
        data: args,
    });
}));
exports.ArgumentControllers = {
    createArgument,
    updateArgument,
    getSingleArgumentById,
    getArgumentsByQuery,
    deleteArgument,
    getArgumentsByQueryInApp,
};
