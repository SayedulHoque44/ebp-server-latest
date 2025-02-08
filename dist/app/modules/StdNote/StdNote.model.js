"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrucchiImageModel = exports.TrucchiModel = void 0;
const mongoose_1 = require("mongoose");
const StdNoteSchema = new mongoose_1.Schema({
    group: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const StdNoteImageSchema = new mongoose_1.Schema({
    StdNoteId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Trucchi",
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
// model
exports.TrucchiModel = (0, mongoose_1.model)("StdNote", StdNoteSchema);
exports.TrucchiImageModel = (0, mongoose_1.model)("TrucchiImage", StdNoteImageSchema);
