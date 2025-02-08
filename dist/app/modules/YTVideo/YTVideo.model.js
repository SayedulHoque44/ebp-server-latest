"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YTVideoModel = void 0;
const mongoose_1 = require("mongoose");
const user_constant_1 = require("../User/user.constant");
const YTVideoSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: user_constant_1.VideoType,
        default: "public",
    },
}, {
    timestamps: true,
});
//
exports.YTVideoModel = (0, mongoose_1.model)("youtubeVideo", YTVideoSchema);
