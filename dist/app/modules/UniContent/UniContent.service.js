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
exports.UniContentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const SubContent_model_1 = require("../SubContent/SubContent.model");
const UniContent_model_1 = require("./UniContent.model");
const globalUtilsFn_1 = require("../../utils/globalUtilsFn");
const s3_1 = require("../../utils/s3");
// create UniContent
const createUniContent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const create = yield UniContent_model_1.UniContentModel.create(payload);
        return create;
    }
    catch (error) {
        const imageUrl = payload.imageUrl;
        if (imageUrl) {
            const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, imageUrl);
            yield (0, s3_1.deleteS3Object)(objectKey);
        }
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create uni content!");
    }
});
// get UniContent
const getAllUniContentByQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const UniContentQuery = new QueryBuilder_1.default(UniContent_model_1.UniContentModel.find(), query)
        .search(["title ", "description"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield UniContentQuery.modelQuery;
    const meta = yield UniContentQuery.countTotal();
    return {
        meta,
        result,
    };
});
// create UniContent
const deleteUniContent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const subContentExits = yield SubContent_model_1.SubContentModel.countDocuments({
        RefId: id,
    });
    if (subContentExits > 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please Delete Sub Content first then try again!");
    }
    const uniContent = yield UniContent_model_1.UniContentModel.findById(id);
    if (!uniContent) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Content Not Found!");
    }
    const del = yield UniContent_model_1.UniContentModel.findByIdAndDelete(id);
    if (!del) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Faild to delete uniContent");
    }
    // Delete Page
    yield SubContent_model_1.SubContentModel.countDocuments({
        RefId: id,
    });
    // Delete img
    const imageUrl = uniContent.imageUrl;
    if (imageUrl) {
        const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, imageUrl);
        yield (0, s3_1.deleteS3Object)(objectKey);
    }
    return del;
});
const updateUniContentIntoDB = (ContentId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const uniContent = yield UniContent_model_1.UniContentModel.findById(ContentId);
    if (!uniContent) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Blog Not Found!");
    }
    const updatedContent = yield UniContent_model_1.UniContentModel.findByIdAndUpdate(ContentId, payload, {
        new: true,
    });
    return updatedContent;
});
exports.UniContentServices = {
    createUniContent,
    getAllUniContentByQuery,
    deleteUniContent,
    updateUniContentIntoDB,
};
