"use strict";
// Importing from aws-sdk v2 (old way - commented out)
// import S3 from "aws-sdk/clients/s3";
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
exports.deleteS3Object = exports.EBP_s3Client = void 0;
// New v3 way - we import just the S3 client and necessary commands
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = __importDefault(require("../config"));
const region = config_1.default.aws_s3_bucket_region;
const accessKeyId = config_1.default.aws_access_key;
const secretAccessKey = config_1.default.aws_secret_key;
// Old v2 client initialization (commented out)
// export const EBP_s3Client = new S3({
//   apiVersion: "2006-03-01",
//   accessKeyId: accessKeyId,
//   secretAccessKey: secretAccessKey,
//   region: region,
//   signatureVersion: "v4",
// });
// New v3 client initialization
exports.EBP_s3Client = new client_s3_1.S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
    // Note: apiVersion and signatureVersion are handled automatically in v3
});
const deleteS3Object = (objectKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            Bucket: config_1.default.aws_s3_bucket_name, // The name of your S3 bucket
            Key: objectKey, // The key (path) of the object to delete
        };
        // Old v2 way (commented out)
        // const result = await EBP_s3Client.deleteObject(params).promise();
        // New v3 way - using Command pattern
        const command = new client_s3_1.DeleteObjectCommand(params);
        const result = yield exports.EBP_s3Client.send(command);
        console.log("Object deleted successfully");
        return result;
    }
    catch (error) {
        console.error("Error deleting object from S3:", error);
        throw error;
    }
});
exports.deleteS3Object = deleteS3Object;
//---------------- Old Code for  aws-sdk ---------------
// import S3 from "aws-sdk/clients/s3";
// import config from "../config";
// const region = config.aws_s3_bucket_region as string;
// const accessKeyId = config.aws_access_key as string;
// const secretAccessKey = config.aws_secret_key as string;
// export const EBP_s3Client = new S3({
//   apiVersion: "2006-03-01",
//   accessKeyId: accessKeyId,
//   secretAccessKey: secretAccessKey,
//   region: region,
//   signatureVersion: "v4",
// });
// export const deleteS3Object = async (objectKey: string) => {
//   try {
//     const params: any = {
//       Bucket: config.aws_s3_bucket_name, // The name of your S3 bucket
//       Key: objectKey, // The key (path) of the object to delete
//     };
//     const result = await EBP_s3Client.deleteObject(params).promise();
//     console.log("Object deleted successfully");
//     return result;
//   } catch (error) {
//     console.error("Error deleting object from S3:", error);
//     throw error;
//   }
// };
