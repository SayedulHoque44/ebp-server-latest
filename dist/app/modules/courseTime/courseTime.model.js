"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseTimesModel = void 0;
const mongoose_1 = require("mongoose");
const courseTime_constant_1 = require("./courseTime.constant");
const coursesTimeSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    durationInMonths: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: courseTime_constant_1.courseTimeStatus,
    },
}, { timestamps: true });
//
exports.courseTimesModel = (0, mongoose_1.model)("courseTime", coursesTimeSchema);
