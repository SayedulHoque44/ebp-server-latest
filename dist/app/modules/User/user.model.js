"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogsModel = exports.userModel = void 0;
const mongoose_1 = require("mongoose");
const user_constant_1 = require("./user.constant");
//  user DeviceLogin
const deviceLoginSchema = new mongoose_1.Schema({
    deviceInfo: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    systemId: {
        type: String,
        required: true,
    },
    userIp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
// user Schema
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
    },
    pin: {
        type: Number,
        required: true,
    },
    email: String,
    propileImageUrl: String,
    paymentStatus: {
        type: String,
        enum: user_constant_1.userPaymentStatus,
        default: "unPaid",
    },
    status: {
        type: String,
        enum: user_constant_1.userStatus,
        default: "Disabled",
    },
    role: {
        type: String,
        enum: user_constant_1.userRole,
        default: "Student",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    group: {
        type: String,
        default: "Free",
    },
    note: String,
    paymantNote: String,
    deviceLogin: [deviceLoginSchema],
    logInAttempt: Number,
}, {
    timestamps: true,
});
// UserLog Schema
const userLogSchema = new mongoose_1.Schema({
    method: {
        type: String,
        enum: ["GET", "POST", "PUT", "DELETE", "PATCH", "UNKNOWN_METHOD"],
        default: "UNKNOWN_METHOD",
    },
    url: {
        type: String,
        default: "UNKNOWN_URL",
    },
    statusCode: {
        type: Number,
        default: 0,
    },
    ipAddress: {
        type: String,
        default: "UNKNOWN_IP",
    },
    userAgent: {
        type: String,
        default: "UNKNOWN_USER_AGENT",
    },
    responseTimeMs: {
        type: Number,
        default: 0,
    },
    systemId: {
        type: String,
        default: "UNKNOWN_SYSTEM",
    },
    userId: {
        type: String,
        default: "UNKNOWN_USER",
    },
    phone: {
        type: String,
        default: "UNKNOWN_PHONE",
    },
    clientReqData: {
        req: {
            type: Object,
            default: {},
        },
        query: {
            type: Object,
            default: {},
        },
        params: {
            type: Object,
            default: {},
        },
    },
    clientResData: {
        type: Object,
        default: {},
    },
}, {
    timestamps: true,
});
//
exports.userModel = (0, mongoose_1.model)("User", userSchema);
exports.userLogsModel = (0, mongoose_1.model)("UserLog", userLogSchema);
