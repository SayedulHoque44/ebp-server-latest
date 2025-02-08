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
exports.QNAPdfServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const QNAPdf_model_1 = require("./QNAPdf.model");
const createQNAPdfIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const create = yield QNAPdf_model_1.QNAPdfModel.create(payload);
    return create;
});
const getAllQNAPdfIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const create = yield QNAPdf_model_1.QNAPdfModel.find().sort("-createdAt");
    return create;
});
const deleteQNAPdfIntoDB = (pdfId) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const deletePDF = yield QNAPdf_model_1.QNAPdfModel.findByIdAndDelete(pdfId);
    if (!deletePDF) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "PDF not found!");
    }
    return null;
});
//
exports.QNAPdfServices = {
    createQNAPdfIntoDB,
    deleteQNAPdfIntoDB,
    getAllQNAPdfIntoDB,
};
