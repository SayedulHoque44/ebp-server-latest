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
exports.deleteS3Object = exports.EBP_s3Client = void 0;
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const config_1 = __importDefault(require("../config"));
const region = config_1.default.aws_s3_bucket_region;
const accessKeyId = config_1.default.aws_access_key;
const secretAccessKey = config_1.default.aws_secret_key;
// export const s3 = new S3({
//   region,
//   accessKeyId,
//   secretAccessKey,
// });
// type TUploadedFile = {
//   name: string; // The original name of the uploaded file
//   // eslint-disable-next-line no-undef
//   data: Buffer; // Binary data of the file
//   size: number; // Size of the file in bytes
//   encoding: string; // Encoding of the file (e.g., '7bit')
//   tempFilePath: string; // Temporary file path (empty if not used)
//   truncated: boolean; // Indicates if the file was truncated due to size limits
//   mimetype: string; // MIME type of the file (e.g., 'image/png')
//   md5: string; // MD5 hash of the file (used for verification)
//   // eslint-disable-next-line no-unused-vars
//   mv: (path: string, callback: (err: Error | null) => void) => void; // Function to move the file to a specified location
// };
// const uploadFile = async (file: TUploadedFile, name = null) => {
//   const newName = file.name.replace(
//     // eslint-disable-next-line no-useless-escape
//     /[`~!@#$%^&*()|+\-=?;:'" ,<>\{\}\[\]\\\/]/gi,
//     "_",
//   );
//   if (!bucketName || !file) {
//     throw new Error("Missing required field! from aws");
//   }
//   const params = {
//     Bucket: bucketName,
//     Key: name ? name : `${Date.now()}_${newName}`,
//     Body: file.data,
//     ContentType: file.mimetype,
//   };
//   return s3.upload(params).promise();
// };
// export const s3Util = {
//   uploadFile,
// };
exports.EBP_s3Client = new s3_1.default({
    apiVersion: "2006-03-01",
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region,
    signatureVersion: "v4",
});
const deleteS3Object = (objectKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            Bucket: config_1.default.aws_s3_bucket_name, // The name of your S3 bucket
            Key: objectKey, // The key (path) of the object to delete
        };
        const result = yield exports.EBP_s3Client.deleteObject(params).promise();
        console.log("Object deleted successfully");
        return result;
    }
    catch (error) {
        console.error("Error deleting object from S3:", error);
        throw error;
    }
});
exports.deleteS3Object = deleteS3Object;
// export const EBP_s3Client = new S3Client({
//   region: region,
//   credentials: {
//     accessKeyId: accessKeyId,
//     secretAccessKey: secretAccessKey,
//   },
// });
