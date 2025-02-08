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
exports.mediaRoutes = exports.fileMaxSize = void 0;
const express_1 = __importDefault(require("express"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const config_1 = __importDefault(require("../../config"));
const s3_1 = require("../../utils/s3");
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const router = express_1.default.Router();
exports.fileMaxSize = 400 * 1024 * 1024; // 400MB
router.post("/uplode-small-file", (0, auth_1.default)("Admin"), (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName, fileType, folderName = "ebp", fileSize } = req.body;
    // Validate input data
    if (!fileName || !fileType || !fileSize) {
        throw new AppError_1.default(http_status_1.default.FAILED_DEPENDENCY, "File name and type are required.");
    }
    if (fileSize > exports.fileMaxSize) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `File limit is max ${exports.fileMaxSize / (1024 * 1024)}mb!`);
    }
    const params = {
        Bucket: config_1.default.aws_s3_bucket_name,
        Key: `${folderName}/${Date.now()}_${fileName}`,
        ContentType: fileType,
        Expires: 3000, // URL valid for 5 minutes
    };
    s3_1.EBP_s3Client.getSignedUrl("putObject", params, (err, presignedUrl) => {
        if (err) {
            throw new AppError_1.default(http_status_1.default.FAILED_DEPENDENCY, "Failed to get Presigned URL");
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: "Presigned URL created successfully!",
            data: { presignedUrl, Key: params.Key },
        });
    });
})));
//  Multi part - Big file uplode START
router.post("/upload/multipart/start", (0, auth_1.default)("Admin"), (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName, fileType, folderName = "ebp", partCount, fileSize, } = req.body;
    // Validate input data
    if (!fileName || !fileType || !partCount || !fileSize) {
        throw new AppError_1.default(http_status_1.default.FAILED_DEPENDENCY, "File name and type And Part Count are required.");
    }
    if (fileSize > exports.fileMaxSize) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `File limit is max ${exports.fileMaxSize / (1024 * 1024)}mb!`);
    }
    const Key = `${folderName}/${Date.now()}_${fileName}`;
    const params = {
        Bucket: config_1.default.aws_s3_bucket_name,
        Key,
        ContentType: fileType,
    };
    try {
        const { UploadId } = yield s3_1.EBP_s3Client.createMultipartUpload(params).promise();
        // Dynamically create presigned URLs only for the required number of parts
        const presignedUrls = Array.from({ length: partCount }, (_, i) => ({
            partNumber: i + 1,
            url: s3_1.EBP_s3Client.getSignedUrl("uploadPart", {
                Bucket: config_1.default.aws_s3_bucket_name,
                Key,
                UploadId,
                PartNumber: i + 1,
                Expires: 3600, // URL valid for 1h minutes
            }),
        }));
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: "PresignedUrl created Successfully!",
            data: { presignedUrls, UploadId, Key },
        });
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.FAILED_DEPENDENCY, "Failed to start multipart upload.");
    }
})));
// //  Multi part - Big file uplode COMPLETE
router.post("/uplode-BigFile/complete", (0, auth_1.default)("Admin"), (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uploadId, parts, Key } = req.body;
    // Validate input data
    if (!uploadId || !parts || !Key || !parts.length) {
        throw new AppError_1.default(http_status_1.default.FAILED_DEPENDENCY, "Invalid input data for completing multipart upload.");
    }
    const params = {
        Bucket: config_1.default.aws_s3_bucket_name,
        Key,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts }, // Array of { ETag, PartNumber }
    };
    try {
        const result = yield s3_1.EBP_s3Client.completeMultipartUpload(params).promise();
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: "Multi Part Completed Successfully!",
            data: { fileUrl: result.Location, Key },
        });
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.FAILED_DEPENDENCY, err.message);
    }
})));
exports.mediaRoutes = router;
