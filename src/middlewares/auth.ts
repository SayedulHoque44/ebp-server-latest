import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../app/config";
import AppError from "../app/error/AppError";
import catchAsync from "../app/utils/catchAsync";

type TRole = "Admin" | "Student";
const auth = (...requiredRole: TRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "unAuthorized user! Token not found",
      );
    }

    try {
      const decode = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const { role, userId, phone } = decode;
      if (!requiredRole.includes(role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, "unAuthorized user role!");
      }

      // const req_ip = req?.ip;
      // const req_connection_remoteAddress = req?.connection?.remoteAddress;
      // const req_socket_remoteAddress = req?.socket?.remoteAddress;
      // const forwarded = req?.headers["x-forwarded-for"];
      // let forwardedIp: string;

      // if (Array.isArray(forwarded)) {
      //   // If it's an array, take the first element
      //   forwardedIp = forwarded[0];
      // } else if (typeof forwarded === "string") {
      //   // If it's a string, split it
      //   forwardedIp = forwarded.split(",")[0];
      // } else {
      //   // Fallback to req.ip
      //   forwardedIp = "none";
      // }
      // const userAgent = req?.headers["user-agent"];

      // const user = await userModel.findOne({ _id: userId });
      // if (user?.role === "Admin") {
      //   await userModel.findByIdAndUpdate(userId, {
      //     $push: {
      //       userInfo: {
      //         req_ip,
      //         req_connection_remoteAddress,
      //         req_socket_remoteAddress,
      //         forwardedIp,
      //         userAgent,
      //       },
      //     },
      //   });
      // }

      (req as any).user = decode;
      next();
    } catch (error: any) {
      throw new AppError(httpStatus.UNAUTHORIZED, error.message);
    }
  });
};

export default auth;
