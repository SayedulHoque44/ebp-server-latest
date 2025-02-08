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
exports.ArgTopicControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const argTopics_service_1 = require("./argTopics.service");
const createArgTopic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdArgTopic = yield argTopics_service_1.ArgTopicServices.createArgTopicIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Argument Topic created Successfully!",
        data: createdArgTopic,
    });
}));
const updateArgTopic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedArgTopic = yield argTopics_service_1.ArgTopicServices.updateArgTopicIntoDB(req.params.argTopicId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Argument Topic updated Successfully!",
        data: updatedArgTopic,
    });
}));
const getSingleArgTopicById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const argTopic = yield argTopics_service_1.ArgTopicServices.getSingleArgTopicByIdFromDb(req.params.argTopicId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Argument Topic retrive Successfully!",
        data: argTopic,
    });
}));
const getArgTopicsByQuery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const args = yield argTopics_service_1.ArgTopicServices.getArgTopicsQueryFromDb(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Argument Topics are retrive Successfully!",
        data: args,
    });
}));
const deleteArgTopic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const argTopic = yield argTopics_service_1.ArgTopicServices.deleteArgTopicFromDB(req.params.argTopicId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Argument Topic Deleted Successfully!",
        data: null,
    });
}));
//
const addTheroyImagesInArgTopic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const argTopic = yield argTopics_service_1.ArgTopicServices.addTheroyImagesInArgTopic(req.params.argTopicId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Theory Images Added Successfully!",
        data: argTopic,
    });
}));
const deleteTheroyImagesFromArgTopic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const argTopic = yield argTopics_service_1.ArgTopicServices.deleteTheroyImagesFromArgTopic(req.params.argTopicId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Theory Images deleted Successfully!",
        data: argTopic,
    });
}));
// ----------- App
const getArgTopicsQueryFromDbinApp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const args = yield argTopics_service_1.ArgTopicServices.getArgTopicsQueryFromDbinApp(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Topics are retrive Successfully!",
        data: args,
    });
}));
exports.ArgTopicControllers = {
    createArgTopic,
    updateArgTopic,
    getSingleArgTopicById,
    getArgTopicsByQuery,
    deleteArgTopic,
    addTheroyImagesInArgTopic,
    deleteTheroyImagesFromArgTopic,
    getArgTopicsQueryFromDbinApp,
};
