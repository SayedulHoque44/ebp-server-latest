import express from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import config from "../../config";
import { EBP_s3Client } from "../../utils/s3";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import auth from "../../../middlewares/auth";

const router = express.Router();

export const fileMaxSize = 400 * 1024 * 1024; // 400MB

router.post(
  "/uplode-small-file",
  auth("Admin"),
  catchAsync(async (req, res) => {
    const { fileName, fileType, folderName = "ebp", fileSize } = req.body;

    // Validate input data
    if (!fileName || !fileType || !fileSize) {
      throw new AppError(
        httpStatus.FAILED_DEPENDENCY,
        "File name and type are required.",
      );
    }

    if (fileSize > fileMaxSize) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `File limit is max ${fileMaxSize / (1024 * 1024)}mb!`,
      );
    }

    const params = {
      Bucket: config.aws_s3_bucket_name,
      Key: `${folderName}/${Date.now()}_${fileName}`,
      ContentType: fileType,
      Expires: 3000, // URL valid for 5 minutes
    };
    EBP_s3Client.getSignedUrl("putObject", params, (err, presignedUrl) => {
      if (err) {
        throw new AppError(
          httpStatus.FAILED_DEPENDENCY,
          "Failed to get Presigned URL",
        );
      }

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Presigned URL created successfully!",
        data: { presignedUrl, Key: params.Key },
      });
    });
  }),
);

//  Multi part - Big file uplode START
router.post(
  "/upload/multipart/start",
  auth("Admin"),
  catchAsync(async (req, res) => {
    const {
      fileName,
      fileType,
      folderName = "ebp",
      partCount,
      fileSize,
    } = req.body;

    // Validate input data
    if (!fileName || !fileType || !partCount || !fileSize) {
      throw new AppError(
        httpStatus.FAILED_DEPENDENCY,
        "File name and type And Part Count are required.",
      );
    }

    if (fileSize > fileMaxSize) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `File limit is max ${fileMaxSize / (1024 * 1024)}mb!`,
      );
    }

    const Key = `${folderName}/${Date.now()}_${fileName}`;
    const params: any = {
      Bucket: config.aws_s3_bucket_name,
      Key,
      ContentType: fileType,
    };

    try {
      const { UploadId } =
        await EBP_s3Client.createMultipartUpload(params).promise();

      // Dynamically create presigned URLs only for the required number of parts
      const presignedUrls = Array.from({ length: partCount }, (_, i) => ({
        partNumber: i + 1,
        url: EBP_s3Client.getSignedUrl("uploadPart", {
          Bucket: config.aws_s3_bucket_name,
          Key,
          UploadId,
          PartNumber: i + 1,
          Expires: 3600, // URL valid for 1h minutes
        }),
      }));

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "PresignedUrl created Successfully!",
        data: { presignedUrls, UploadId, Key },
      });
    } catch (err) {
      throw new AppError(
        httpStatus.FAILED_DEPENDENCY,
        "Failed to start multipart upload.",
      );
    }
  }),
);

// //  Multi part - Big file uplode COMPLETE
router.post(
  "/uplode-BigFile/complete",
  auth("Admin"),
  catchAsync(async (req, res) => {
    const { uploadId, parts, Key } = req.body;

    // Validate input data
    if (!uploadId || !parts || !Key || !parts.length) {
      throw new AppError(
        httpStatus.FAILED_DEPENDENCY,
        "Invalid input data for completing multipart upload.",
      );
    }

    const params: any = {
      Bucket: config.aws_s3_bucket_name,
      Key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts }, // Array of { ETag, PartNumber }
    };

    try {
      const result =
        await EBP_s3Client.completeMultipartUpload(params).promise();
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Multi Part Completed Successfully!",
        data: { fileUrl: result.Location, Key },
      });
    } catch (err: any) {
      throw new AppError(httpStatus.FAILED_DEPENDENCY, err.message);
    }
  }),
);

export const mediaRoutes = router;
