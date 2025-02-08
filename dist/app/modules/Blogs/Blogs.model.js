"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = void 0;
const mongoose_1 = require("mongoose");
const Blogs_constant_1 = require("./Blogs.constant");
const blogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Blogs_constant_1.BlogType,
    },
    tags: String,
    pin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
//
exports.BlogModel = (0, mongoose_1.model)("Blog", blogSchema);
