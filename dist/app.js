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
const SaveLogsData_1 = __importDefault(require("./middlewares/SaveLogsData"));
const utils_1 = require("./app/utils/utils");
const app = (0, express_1.default)();
// const port = 3000;
// parser
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
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
app.use(SaveLogsData_1.default);
app.use("/api/", routes_1.default);
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
(0, utils_1.deleteOldUserLogs)(); // This initializes the cron job
// console.log(process.cwd());
// ErrorHandler
app.use(globalErrorHandler_1.default);
// // notFound or API crash
app.use(notFoundHandler_1.default);
exports.default = app;
// git feature/user_logs
