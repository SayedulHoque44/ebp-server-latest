"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QNAPdfModel = void 0;
const mongoose_1 = require("mongoose");
const QNAPdfSchema = new mongoose_1.Schema({
    title: String,
    link: String,
}, { timestamps: true });
exports.QNAPdfModel = (0, mongoose_1.model)("QNAPdf", QNAPdfSchema);
