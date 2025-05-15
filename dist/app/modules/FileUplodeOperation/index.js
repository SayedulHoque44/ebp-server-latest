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
// New v3 imports
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
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
    const Key = `${folderName}/${Date.now()}_${fileName.replace(/\s+/g, "_")}`; // Sanitize filename
    // Old v2 approach (commented)
    // const params = {
    //   Bucket: config.aws_s3_bucket_name,
    //   Key: `${folderName}/${Date.now()}_${fileName}`,
    //   ContentType: fileType,
    //   Expires: 3000, // URL valid for 5 minutes
    // };
    // EBP_s3Client.getSignedUrl("putObject", params, (err, presignedUrl) => {
    //   if (err) {
    //     throw new AppError(
    //       httpStatus.FAILED_DEPENDENCY,
    //       "Failed to get Presigned URL",
    //     );
    //   }
    //   sendResponse(res, {
    //     statusCode: 201,
    //     success: true,
    //     message: "Presigned URL created successfully!",
    //     data: { presignedUrl, Key: params.Key },
    //   });
    // });
    // New v3 approach
    try {
        // Generate presigned URL using v3 method
        const presignedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3_1.EBP_s3Client, new client_s3_1.PutObjectCommand({
            Bucket: config_1.default.aws_s3_bucket_name,
            Key,
            ContentType: fileType,
        }), { expiresIn: 300 });
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: "Presigned URL created successfully!",
            data: { presignedUrl, Key },
        });
    }
    catch (err) {
        console.error("Presigned URL error:", err);
        throw new AppError_1.default(http_status_1.default.FAILED_DEPENDENCY, "Failed to generate presigned URL");
    }
})));
// Multi part - Big file upload START
router.post("/upload/multipart/start", (0, auth_1.default)("Admin"), (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName, fileType, folderName = "ebp", partCount, fileSize, } = req.body;
    // Validate input data
    if (!fileName || !fileType || !partCount || !fileSize) {
        throw new AppError_1.default(http_status_1.default.FAILED_DEPENDENCY, "File name and type And Part Count are required.");
    }
    if (fileSize > exports.fileMaxSize) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `File limit is max ${exports.fileMaxSize / (1024 * 1024)}mb!`);
    }
    const Key = `${folderName}/${Date.now()}_${fileName.replace(/\s+/g, "_")}`;
    // Old v2 approach (commented)
    // const params: any = {
    //   Bucket: config.aws_s3_bucket_name,
    //   Key,
    //   ContentType: fileType,
    // };
    // try {
    //   const { UploadId } =
    //     await EBP_s3Client.createMultipartUpload(params).promise();
    //   const presignedUrls = Array.from({ length: partCount }, (_, i) => ({
    //     partNumber: i + 1,
    //     url: EBP_s3Client.getSignedUrl("uploadPart", {
    //       Bucket: config.aws_s3_bucket_name,
    //       Key,
    //       UploadId,
    //       PartNumber: i + 1,
    //       Expires: 3600, // URL valid for 1h minutes
    //     }),
    //   }));
    //   sendResponse(res, {
    //     statusCode: 201,
    //     success: true,
    //     message: "PresignedUrl created Successfully!",
    //     data: { presignedUrls, UploadId, Key },
    //   });
    // } catch (err) {
    //   throw new AppError(
    //     httpStatus.FAILED_DEPENDENCY,
    //     "Failed to start multipart upload.",
    //   );
    // }
    // New v3 approach
    try {
        // Create multipart upload
        const { UploadId } = yield s3_1.EBP_s3Client.send(new client_s3_1.CreateMultipartUploadCommand({
            Bucket: config_1.default.aws_s3_bucket_name,
            Key,
            ContentType: fileType,
        }));
        // Generate presigned URLs for each part
        const presignedUrls = yield Promise.all(Array.from({ length: partCount }, (_, i) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                partNumber: i + 1,
                url: yield (0, s3_request_presigner_1.getSignedUrl)(s3_1.EBP_s3Client, new client_s3_1.UploadPartCommand({
                    Bucket: config_1.default.aws_s3_bucket_name,
                    Key,
                    UploadId,
                    PartNumber: i + 1,
                }), { expiresIn: 3600 }),
            });
        })));
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: "PresignedUrl created Successfully!",
            data: { presignedUrls, UploadId, Key },
        });
    }
    catch (err) {
        console.error("Multipart upload error:", err);
        throw new AppError_1.default(http_status_1.default.FAILED_DEPENDENCY, "Failed to initiate multipart upload");
    }
})));
// Multi part - Big file upload COMPLETE
router.post("/uplode-BigFile/complete", (0, auth_1.default)("Admin"), (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uploadId, parts, Key } = req.body;
    // Validate input data
    if (!uploadId || !(parts === null || parts === void 0 ? void 0 : parts.length) || !Key) {
        throw new AppError_1.default(http_status_1.default.FAILED_DEPENDENCY, "Upload ID, parts array and Key are required.");
    }
    // Old v2 approach (commented)
    // const params: any = {
    //   Bucket: config.aws_s3_bucket_name,
    //   Key,
    //   UploadId: uploadId,
    //   MultipartUpload: { Parts: parts }, // Array of { ETag, PartNumber }
    // };
    // try {
    //   const result =
    //     await EBP_s3Client.completeMultipartUpload(params).promise();
    //   sendResponse(res, {
    //     statusCode: 201,
    //     success: true,
    //     message: "Multi Part Completed Successfully!",
    //     data: { fileUrl: result.Location, Key },
    //   });
    // } catch (err: any) {
    //   throw new AppError(httpStatus.FAILED_DEPENDENCY, err.message);
    // }
    // New v3 approach
    try {
        const { Location } = yield s3_1.EBP_s3Client.send(new client_s3_1.CompleteMultipartUploadCommand({
            Bucket: config_1.default.aws_s3_bucket_name,
            Key,
            UploadId: uploadId,
            MultipartUpload: {
                Parts: parts.map((part) => ({
                    ETag: part.ETag,
                    PartNumber: part.PartNumber,
                })),
            },
        }));
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: "Multipart upload completed successfully!",
            data: { fileUrl: Location, Key },
        });
    }
    catch (err) {
        console.error("Complete upload error:", err);
        throw new AppError_1.default(http_status_1.default.FAILED_DEPENDENCY, err.message || "Failed to complete multipart upload");
    }
})));
// ---------------- Old Code for  aws-sdk ---------------
// router.post(
//   "/uplode-small-file",
//   auth("Admin"),
//   catchAsync(async (req, res) => {
//     const { fileName, fileType, folderName = "ebp", fileSize } = req.body;
//     // Validate input data
//     if (!fileName || !fileType || !fileSize) {
//       throw new AppError(
//         httpStatus.FAILED_DEPENDENCY,
//         "File name and type are required.",
//       );
//     }
//     if (fileSize > fileMaxSize) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         `File limit is max ${fileMaxSize / (1024 * 1024)}mb!`,
//       );
//     }
//     const params = {
//       Bucket: config.aws_s3_bucket_name,
//       Key: `${folderName}/${Date.now()}_${fileName}`,
//       ContentType: fileType,
//       Expires: 3000, // URL valid for 5 minutes
//     };
//     EBP_s3Client.getSignedUrl("putObject", params, (err, presignedUrl) => {
//       if (err) {
//         throw new AppError(
//           httpStatus.FAILED_DEPENDENCY,
//           "Failed to get Presigned URL",
//         );
//       }
//       sendResponse(res, {
//         statusCode: 201,
//         success: true,
//         message: "Presigned URL created successfully!",
//         data: { presignedUrl, Key: params.Key },
//       });
//     });
//   }),
// );
//--------
//  Multi part - Big file uplode START
// router.post(
//   "/upload/multipart/start",
//   auth("Admin"),
//   catchAsync(async (req, res) => {
//     const {
//       fileName,
//       fileType,
//       folderName = "ebp",
//       partCount,
//       fileSize,
//     } = req.body;
//     // Validate input data
//     if (!fileName || !fileType || !partCount || !fileSize) {
//       throw new AppError(
//         httpStatus.FAILED_DEPENDENCY,
//         "File name and type And Part Count are required.",
//       );
//     }
//     if (fileSize > fileMaxSize) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         `File limit is max ${fileMaxSize / (1024 * 1024)}mb!`,
//       );
//     }
//     const Key = `${folderName}/${Date.now()}_${fileName}`;
//     const params: any = {
//       Bucket: config.aws_s3_bucket_name,
//       Key,
//       ContentType: fileType,
//     };
//     try {
//       const { UploadId } =
//         await EBP_s3Client.createMultipartUpload(params).promise();
//       // Dynamically create presigned URLs only for the required number of parts
//       const presignedUrls = Array.from({ length: partCount }, (_, i) => ({
//         partNumber: i + 1,
//         url: EBP_s3Client.getSignedUrl("uploadPart", {
//           Bucket: config.aws_s3_bucket_name,
//           Key,
//           UploadId,
//           PartNumber: i + 1,
//           Expires: 3600, // URL valid for 1h minutes
//         }),
//       }));
//       sendResponse(res, {
//         statusCode: 201,
//         success: true,
//         message: "PresignedUrl created Successfully!",
//         data: { presignedUrls, UploadId, Key },
//       });
//     } catch (err) {
//       throw new AppError(
//         httpStatus.FAILED_DEPENDENCY,
//         "Failed to start multipart upload.",
//       );
//     }
//   }),
// );
//--------
// //  Multi part - Big file uplode COMPLETE
// router.post(
//   "/uplode-BigFile/complete",
//   auth("Admin"),
//   catchAsync(async (req, res) => {
//     const { uploadId, parts, Key } = req.body;
//     // Validate input data
//     if (!uploadId || !parts || !Key || !parts.length) {
//       throw new AppError(
//         httpStatus.FAILED_DEPENDENCY,
//         "Invalid input data for completing multipart upload.",
//       );
//     }
//     const params: any = {
//       Bucket: config.aws_s3_bucket_name,
//       Key,
//       UploadId: uploadId,
//       MultipartUpload: { Parts: parts }, // Array of { ETag, PartNumber }
//     };
//     try {
//       const result =
//         await EBP_s3Client.completeMultipartUpload(params).promise();
//       sendResponse(res, {
//         statusCode: 201,
//         success: true,
//         message: "Multi Part Completed Successfully!",
//         data: { fileUrl: result.Location, Key },
//       });
//     } catch (err: any) {
//       throw new AppError(httpStatus.FAILED_DEPENDENCY, err.message);
//     }
//   }),
// );
exports.mediaRoutes = router;
