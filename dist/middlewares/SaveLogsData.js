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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../app/config"));
const user_model_1 = require("../app/modules/User/user.model");
const SaveLogsDataOfuser = (req, res, next) => {
    const start = Date.now(); // Start time
    // Added an event listener to execute when the response is finished
    res.on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (token) {
            const method = req.method || "UNKNOWN_METHOD";
            const url = req.originalUrl || "UNKNOWN_URL";
            const statusCode = res.statusCode || "UNKNOWN_STATUS_CODE";
            const ipAddress = req.headers["x-forwarded-for"] || req.ip || "UNKNOWN_IP";
            const userAgent = req.headers["user-agent"] || "UNKNOWN_USER_AGENT";
            const responseTimeMs = Date.now() - start; // Calculate response time
            const systemId = req.headers["x-system-id"] || "UNKNOWN_SYSTEM";
            const clientResData = res.locals.data || {};
            let userId = "UNKNOWN_USER";
            const clientReqData = {
                req: req.body,
                query: req.query,
                params: req.params,
            };
            // Verify the token
            const decode = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
            const { role, userId: user_id, phone } = decode;
            if (userId) {
                userId = user_id;
            }
            const logData = {
                method,
                url,
                statusCode,
                ipAddress,
                userAgent,
                responseTimeMs,
                systemId,
                userId,
                clientReqData,
                clientResData,
                phone,
            };
            //console.log("Request Log:", logData); // Log or save to database
            yield user_model_1.userLogsModel.create(logData);
        }
    }));
    // Proceed to the next middleware or route
    next();
};
exports.default = SaveLogsDataOfuser;
