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
exports.ConfigLimiter = void 0;
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const RateLimit_model_1 = require("../../app/modules/RateLimiter/RateLimit.model");
function createRateLimiter({ windowMs, maxRequests, type, }) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        // Determine identifier based on type
        let identifier;
        const ipAddress = req.headers["x-forwarded-for"] || req.ip || "UNKNOWN_IP";
        switch (type) {
            case "auth":
                identifier = `auth:${ipAddress}`;
                break;
            case "api":
                identifier = req.user
                    ? `api:user:${req.user.id}`
                    : `api:ip:${ipAddress}`;
                break;
            default:
                identifier = `global:${ipAddress}`;
        }
        const { allowed, remaining, reset, timeLeft } = yield CheckRateLimit(identifier, windowMs, maxRequests);
        if (!allowed) {
            // const retryAfter = Math.ceil(
            //   (reset.getTime() - new Date().getTime()) / 1000,
            // );
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.TOO_MANY_REQUESTS,
                success: false,
                message: `Too many requests! Limit exceeded. Try again in ${timeLeft}`,
                data: {
                    "RateLimit-Limit": maxRequests.toString(),
                    "RateLimit-Remaining": remaining.toString(),
                    "RateLimit-Reset": Math.floor(reset.getTime() / 1000).toString(),
                },
            });
            // return res.status(429).json({
            //   error: "Too many requests",
            //   message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
            //   retryAfter,
            // });
        }
        // Set rate limit headers
        res.set({
            "X-RateLimit-Limit": maxRequests.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": Math.floor(reset.getTime() / 1000).toString(),
        });
        next();
    });
}
const CheckRateLimit = (identifier, windowMs, maxRequests) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMs);
    try {
        // First try to update existing record within current window
        let result = yield RateLimit_model_1.RateLimitModel.findOneAndUpdate({
            key: identifier,
            firstRequest: { $gte: windowStart }, // Within current window
        }, {
            $inc: { count: 1 },
            $set: { lastRequest: now },
        }, {
            new: true,
            projection: { count: 1, firstRequest: 1 },
        });
        // If no update happened, either window expired or record doesn't exist
        if (!result) {
            result = yield RateLimit_model_1.RateLimitModel.findOneAndUpdate({
                key: identifier,
                // Only reset if window has expired or doesn't exist
                $or: [
                    { firstRequest: { $lt: windowStart } },
                    { firstRequest: { $exists: false } },
                ],
            }, {
                $set: {
                    count: 1,
                    firstRequest: now,
                    lastRequest: now,
                },
            }, {
                new: true,
                upsert: true,
                projection: { count: 1, firstRequest: 1 },
            });
        }
        if (!result) {
            throw new Error("Rate limit record not found or created");
        }
        // Calculate remaining requests and reset time
        const remaining = Math.max(0, maxRequests - result.count);
        const resetTimestamp = result.firstRequest.getTime() + windowMs;
        const resetTime = new Date(resetTimestamp);
        const secondsLeft = Math.ceil((resetTimestamp - now.getTime()) / 1000);
        // Format the time left in human-readable way
        let timeLeftFormatted = "";
        if (secondsLeft <= 60) {
            timeLeftFormatted = `${secondsLeft} sec`;
        }
        else {
            const minutes = Math.floor(secondsLeft / 60);
            const seconds = secondsLeft % 60;
            if (minutes < 60) {
                timeLeftFormatted = `${minutes} min${seconds > 0 ? ` ${seconds} sec` : ""}`;
            }
            else {
                const hours = Math.floor(minutes / 60);
                const remainingMinutes = minutes % 60;
                timeLeftFormatted = `${hours} hour${hours > 1 ? "s" : ""}`;
                if (remainingMinutes > 0) {
                    timeLeftFormatted += ` ${remainingMinutes} min`;
                }
                if (seconds > 0 && remainingMinutes === 0) {
                    timeLeftFormatted += ` ${seconds} sec`;
                }
            }
        }
        return {
            allowed: remaining > 0,
            remaining: remaining,
            reset: resetTime,
            timeLeft: timeLeftFormatted, // Added human-readable time left
        };
    }
    catch (err) {
        console.error("Rate limit check error:", err);
        // Fail open - allow request if rate limiter fails
        return { allowed: true, remaining: maxRequests, reset: now, timeLeft: "" };
    }
});
exports.ConfigLimiter = {
    global: createRateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 1000,
        type: "global",
    }),
    auth: createRateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5,
        type: "auth",
    }),
    api: createRateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 500,
        type: "api",
    }),
};
exports.default = createRateLimiter;
