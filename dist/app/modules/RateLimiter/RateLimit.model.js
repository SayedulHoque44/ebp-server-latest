"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Optimized Rate Limit Schema
const rateLimitSchema = new mongoose_1.default.Schema({
    key: {
        type: String,
        required: true,
        index: true,
        unique: true,
        collation: { locale: "en", strength: 1 }, // Case-insensitive index
    },
    count: {
        type: Number,
        min: 0,
    },
    firstRequest: {
        type: Date,
        default: Date.now,
    },
    lastRequest: {
        type: Date,
        index: { expireAfterSeconds: 3600 }, // TTL index
    },
}, {
    autoIndex: true,
    minimize: false, // Better storage alignment
});
const RateLimitModel = mongoose_1.default.model("RateLimit", rateLimitSchema);
exports.RateLimitModel = RateLimitModel;
