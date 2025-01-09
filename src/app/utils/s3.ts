import S3 from "aws-sdk/clients/s3";
import config from "../config";

const region = config.aws_s3_bucket_region as string;
const accessKeyId = config.aws_access_key as string;
const secretAccessKey = config.aws_secret_key as string;

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

export const EBP_s3Client = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region,
  signatureVersion: "v4",
});

export const deleteS3Object = async (objectKey: string) => {
  try {
    const params: any = {
      Bucket: config.aws_s3_bucket_name, // The name of your S3 bucket
      Key: objectKey, // The key (path) of the object to delete
    };

    const result = await EBP_s3Client.deleteObject(params).promise();
    console.log("Object deleted successfully");
    return result;
  } catch (error) {
    console.error("Error deleting object from S3:", error);
    throw error;
  }
};

// export const EBP_s3Client = new S3Client({
//   region: region,
//   credentials: {
//     accessKeyId: accessKeyId,
//     secretAccessKey: secretAccessKey,
//   },
// });
