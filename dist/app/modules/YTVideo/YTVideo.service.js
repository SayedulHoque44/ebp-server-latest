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
exports.YTVIdeoServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const YTVideo_model_1 = require("./YTVideo.model");
const createYTVideo = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const create = yield YTVideo_model_1.YTVideoModel.create(payload);
    return create;
});
const deleteVideo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield YTVideo_model_1.YTVideoModel.findByIdAndDelete(id);
    return deleted;
});
const getAll = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const Videos = new QueryBuilder_1.default(YTVideo_model_1.YTVideoModel.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield Videos.modelQuery;
    const meta = yield Videos.countTotal();
    return {
        meta,
        result,
    };
});
exports.YTVIdeoServices = {
    createYTVideo,
    deleteVideo,
    getAll,
};
