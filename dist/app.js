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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const notFoundHandler_1 = __importDefault(require("./middlewares/notFoundHandler"));
const RateLimit_model_1 = require("./app/modules/RateLimiter/RateLimit.model");
const CreateRateLimiter_1 = require("./middlewares/RateLimiter/CreateRateLimiter");
const app = (0, express_1.default)();
// const port = 3000;
// parser
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:4173",
        "https://easybanglapatente.com",
        "https://easy-bangla-patente.web.app",
    ],
}));
// app.use(
//   cors({
//     origin: "*",
//   }),
// );
// Monitoring Middleware
// app.use(SaveLogsDataOfuser);
// Apply global rate limiter to all routes
app.use(CreateRateLimiter_1.ConfigLimiter.global);
app.use("/api/", routes_1.default);
// Monitoring endpoint
app.get("/api/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memoryUsage = process.memoryUsage();
        const rateLimitRecords = yield RateLimit_model_1.RateLimitModel.estimatedDocumentCount();
        res.json({
            rateLimitRecords,
            rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
            heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
            heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
            memoryUsage: memoryUsage,
        });
    }
    catch (err) {
        res.status(500).json({ error: "Monitoring unavailable" });
    }
}));
//
const starter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Easy Bangla Patente 🚗!");
});
app.get("/", starter);
// test route
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
app.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Promise.reject();
    }
    catch (error) {
        res.send("Erro Occurs test mai n i am changes");
    }
}));
// Start the cron job
// deleteOldUserLogs(); // This initializes the cron job
// console.log(process.cwd());
// ErrorHandler
app.use(globalErrorHandler_1.default);
// // notFound or API crash
app.use(notFoundHandler_1.default);
exports.default = app;
// git feature/user_logs
