"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv")); //dotenv
const path_1 = __importDefault(require("path")); //node.js buildin mobule
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") }); //-->(currentWorkingDirectory+.env)
exports.default = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.mongoDbUrl,
    //   default_pass: process.env.DEFAULT_PASS,
    //   jwt_refresh_secret: process.env.JWT_REFRESH_SECRCT,
    //   jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    jwt_access_secret: process.env.JWT_ACCESS_SECRCT,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    aws_s3_bucket_name: process.env.AWS_S3_BUCKET_NAME,
    aws_s3_bucket_region: process.env.AWS_S3_BUCKET_REGION,
    aws_access_key: process.env.AWS_ACCESS_KEY,
    aws_secret_key: process.env.AWS_SECRET_KEY,
};
