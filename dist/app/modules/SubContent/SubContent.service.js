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
exports.SubContentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const UniContent_model_1 = require("../UniContent/UniContent.model");
const SubContent_model_1 = require("./SubContent.model");
const globalUtilsFn_1 = require("../../utils/globalUtilsFn");
const s3_1 = require("../../utils/s3");
//------------- SubContent
// create SubContent
const createSubContent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const UniContent = yield UniContent_model_1.UniContentModel.findById(payload.RefId);
        if (!UniContent) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Content Not Found!");
        }
        const indexed = yield SubContent_model_1.SubContentModel.countDocuments({
            RefId: payload.RefId,
        });
        payload.index = indexed + 1;
        const create = yield SubContent_model_1.SubContentModel.create(payload);
        return create;
    }
    catch (error) {
        const imageUrl = payload.imageUrl;
        const url = payload.url;
        if (imageUrl) {
            const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, imageUrl);
            yield (0, s3_1.deleteS3Object)(objectKey);
        }
        if (url) {
            const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, url);
            yield (0, s3_1.deleteS3Object)(objectKey);
        }
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create Sub content!");
    }
});
// get SubContent
const getAllSubContentByQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const SubContentQuery = new QueryBuilder_1.default(SubContent_model_1.SubContentModel.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield SubContentQuery.modelQuery.populate(["RefId"]);
    const meta = yield SubContentQuery.countTotal();
    return {
        meta,
        result,
    };
});
// create SubContent
const deleteSubContent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const subContent = yield SubContent_model_1.SubContentModel.findById(id);
    if (!subContent) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Sub Content Not found!");
    }
    //
    const del = yield SubContent_model_1.SubContentModel.findByIdAndDelete(id);
    //
    const imageUrl = subContent.imageUrl;
    const url = subContent.url;
    //
    if (imageUrl) {
        const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, imageUrl);
        yield (0, s3_1.deleteS3Object)(objectKey);
    }
    //
    if (url) {
        const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, url);
        yield (0, s3_1.deleteS3Object)(objectKey);
    }
    return del;
});
const updateSubContentIntoDB = (ContentId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subContent = yield SubContent_model_1.SubContentModel.findById(ContentId);
        if (!subContent) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Content Not Found!");
        }
        const updatedContent = yield SubContent_model_1.SubContentModel.findByIdAndUpdate(ContentId, payload, {
            new: true,
        });
        // If already there imageUrl exits !! then delet previous one if want to set new one
        if (payload.imageUrl) {
            const previousSubContentImgurl = subContent.imageUrl;
            if (previousSubContentImgurl) {
                const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, previousSubContentImgurl);
                yield (0, s3_1.deleteS3Object)(objectKey);
            }
        }
        if (payload.url) {
            const previousSubCotentUrl = subContent.url;
            if (previousSubCotentUrl) {
                const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, previousSubCotentUrl);
                yield (0, s3_1.deleteS3Object)(objectKey);
            }
        }
        return updatedContent;
    }
    catch (error) {
        if (payload.imageUrl) {
            const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, payload.imageUrl);
            yield (0, s3_1.deleteS3Object)(objectKey);
        }
        if (payload.url) {
            const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, payload.url);
            yield (0, s3_1.deleteS3Object)(objectKey);
        }
    }
    throw new AppError_1.default(http_status_1.default.FAILED_DEPENDENCY, "Faild to update Sub Content!");
});
exports.SubContentServices = {
    createSubContent,
    getAllSubContentByQuery,
    deleteSubContent,
    updateSubContentIntoDB,
};
