// Importing from aws-sdk v2 (old way - commented out)
// import S3 from "aws-sdk/clients/s3";

// New v3 way - we import just the S3 client and necessary commands
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import config from "../config";

const region = config.aws_s3_bucket_region as string;
const accessKeyId = config.aws_access_key as string;
const secretAccessKey = config.aws_secret_key as string;

// Old v2 client initialization (commented out)
// export const EBP_s3Client = new S3({
//   apiVersion: "2006-03-01",
//   accessKeyId: accessKeyId,
//   secretAccessKey: secretAccessKey,
//   region: region,
//   signatureVersion: "v4",
// });

// New v3 client initialization
export const EBP_s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  // Note: apiVersion and signatureVersion are handled automatically in v3
});

export const deleteS3Object = async (objectKey: string) => {
  try {
    const params = {
      Bucket: config.aws_s3_bucket_name, // The name of your S3 bucket
      Key: objectKey, // The key (path) of the object to delete
    };

    // Old v2 way (commented out)
    // const result = await EBP_s3Client.deleteObject(params).promise();

    // New v3 way - using Command pattern
    const command = new DeleteObjectCommand(params);
    const result = await EBP_s3Client.send(command);

    console.log("Object deleted successfully");
    return result;
  } catch (error) {
    console.error("Error deleting object from S3:", error);
    throw error;
  }
};

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
