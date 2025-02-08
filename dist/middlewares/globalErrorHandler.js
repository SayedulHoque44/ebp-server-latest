"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const config_1 = __importDefault(require("../app/config"));
const AppError_1 = __importDefault(require("../app/error/AppError"));
const handleDuplicateError_1 = require("../app/error/handleDuplicateError");
const handleValidationError_1 = __importDefault(require("../app/error/handleValidationError"));
const handleZodError_1 = __importDefault(require("../app/error/handleZodError"));
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
    //setting default values
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorSources = [
        {
            path: "",
            message: "Something went wrong",
        },
    ];
    // handle multiple type error
    if (err instanceof zod_1.ZodError) {
        //Zod Error
        const simplifiedError = (0, handleZodError_1.default)(err);
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
        statusCode = 400;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "ValidationError") {
        //Validation Error
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = 400;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if (err instanceof AppError_1.default) {
        //App Error
        message = err.message;
        statusCode = err.statusCode;
        errorSources = [
            {
                path: "Custom Error",
                message: err.message,
            },
        ];
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        //check duplicate user
        message = (0, handleDuplicateError_1.handleDupliacteError)(err);
    }
    //ultimate return
    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err,
        stack: config_1.default.node_env === "development" ? err === null || err === void 0 ? void 0 : err.stack : null,
    });
};
exports.default = globalErrorHandler;
