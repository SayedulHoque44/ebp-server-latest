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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubContentModel = void 0;
const mongoose_1 = require("mongoose");
const globalUtilsFn_1 = require("../../utils/globalUtilsFn");
const s3_1 = require("../../utils/s3");
const SubContentSchema = new mongoose_1.Schema({
    RefId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "UniContent",
        required: true,
    },
    title: {
        type: String,
    },
    info: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    url: {
        type: String,
    },
    youtubeUrl: {
        type: String,
    },
    index: {
        type: Number,
    },
}, {
    timestamps: true,
});
// model
exports.SubContentModel = (0, mongoose_1.model)("SubContent", SubContentSchema);
SubContentSchema.pre("deleteMany", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // `this` refers to the query being executed
            const query = this.getFilter(); // Get the filter used for the deleteMany operation
            console.log(query);
            // Find the documents matching the query
            const docs = yield exports.SubContentModel.find(query);
            // Loop through the documents and delete their associated images
            for (const doc of docs) {
                if (doc.imageUrl) {
                    console.log(doc.imageUrl);
                    const objectKey = (0, globalUtilsFn_1.getObjectKeyFromUrl)(globalUtilsFn_1.EBP_Images_CDN_BaseUrl, doc.imageUrl);
                    yield (0, s3_1.deleteS3Object)(objectKey);
                }
            }
            next();
        }
        catch (error) {
            console.error("Error in pre-deleteMany middleware:", error);
            next(error);
        }
    });
});
