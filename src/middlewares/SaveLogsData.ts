/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../app/config";
const SaveLogsDataOfuser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now(); // Start time
  res.on("finish", () => {
    const duration = Date.now() - start; // Calculate response time
    const systemId = req.headers["x-system-id"];
    const token = req.headers.authorization;
    const logData: any = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      ipAddress: req.headers["x-forwarded-for"] || req.ip,
      userAgent: req.headers["user-agent"],
      responseTimeMs: duration,
    };

    if (systemId) {
      logData["systemId"] = systemId;
    }

    if (token) {
      const decode = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
      const { role, userId, phone } = decode;
      if (userId) {
        logData["userId"] = userId;
      }
    }
    console.log("Request Log:", logData); // Log or save to database
  });
  next(); // Proceed to the next middleware or route
};

export default SaveLogsDataOfuser;
