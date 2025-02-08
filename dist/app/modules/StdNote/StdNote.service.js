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
exports.trucchiServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const StdNote_model_1 = require("./StdNote.model");
//------------- trucchi
// create Trucchi
const createTrucchi = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const create = yield StdNote_model_1.TrucchiModel.create(payload);
    return create;
});
// get Trucchi
const getAllTrucchiByQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const TrucchiQuery = new QueryBuilder_1.default(StdNote_model_1.TrucchiModel.find(), query)
        .search(["title ", "description"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield TrucchiQuery.modelQuery;
    const meta = yield TrucchiQuery.countTotal();
    return {
        meta,
        result,
    };
});
// create Trucchi
const deleteTrucchi = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const del = yield StdNote_model_1.TrucchiModel.findByIdAndDelete(id);
    // delete images also
    yield StdNote_model_1.TrucchiImageModel.deleteMany({
        trucchiId: id,
    });
    return del;
});
//-------------trucchi image
// create Trucchi image
const createTrucchiImage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const trucchi = yield StdNote_model_1.TrucchiModel.findById(payload.StdNoteId);
    if (!trucchi) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Trucchi Not Found!");
    }
    const trucchiImages = yield StdNote_model_1.TrucchiImageModel.countDocuments();
    payload.index = trucchiImages + 1;
    const create = yield StdNote_model_1.TrucchiImageModel.create(payload);
    return create;
});
const getAllTrucchiImagesByTrucchiId = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const TrucchiImagesQuery = new QueryBuilder_1.default(StdNote_model_1.TrucchiImageModel.find(), query)
        .search(["title ", "description"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield TrucchiImagesQuery.modelQuery; //.populate("trucchiId");
    const meta = yield TrucchiImagesQuery.countTotal();
    return {
        meta,
        result,
    };
});
// create Trucchi
const deleteTrucchiImage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const del = yield StdNote_model_1.TrucchiImageModel.findByIdAndDelete(id);
    return del;
});
exports.trucchiServices = {
    createTrucchi,
    getAllTrucchiByQuery,
    deleteTrucchi,
    createTrucchiImage,
    getAllTrucchiImagesByTrucchiId,
    deleteTrucchiImage,
};
