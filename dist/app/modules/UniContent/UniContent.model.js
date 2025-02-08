"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniContentModel = void 0;
const mongoose_1 = require("mongoose");
const UniContentSchema = new mongoose_1.Schema({
    contentType: {
        type: String,
        required: true,
    },
    title: String,
    description: String,
    imageUrl: String,
}, { timestamps: true });
// model
exports.UniContentModel = (0, mongoose_1.model)("UniContent", UniContentSchema);
