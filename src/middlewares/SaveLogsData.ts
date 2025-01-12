/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../app/config";
import { TUserLogs } from "../app/modules/User/user.interface";
import { userLogsModel } from "../app/modules/User/user.model";
const SaveLogsDataOfuser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now(); // Start time

  // Added an event listener to execute when the response is finished
  res.on("finish", async () => {
    const token = req.headers.authorization;

    if (token) {
      const method = req.method || "UNKNOWN_METHOD";
      const url = req.originalUrl || "UNKNOWN_URL";
      const statusCode = res.statusCode || "UNKNOWN_STATUS_CODE";
      const ipAddress =
        req.headers["x-forwarded-for"] || req.ip || "UNKNOWN_IP";
      const userAgent = req.headers["user-agent"] || "UNKNOWN_USER_AGENT";
      const responseTimeMs = Date.now() - start; // Calculate response time
      const systemId = req.headers["x-system-id"] || "UNKNOWN_SYSTEM";
      const clientResData = res.locals.data || {};
      let userId = "UNKNOWN_USER";
      const clientReqData = {
        req: req.body,
        query: req.query,
        params: req.params,
      };

      // Verify the token
      const decode = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
      const { role, userId: user_id, phone } = decode;
      if (userId) {
        userId = user_id;
      }

      const logData: any = {
        method,
        url,
        statusCode,
        ipAddress,
        userAgent,
        responseTimeMs,
        systemId,
        userId,
        clientReqData,
        clientResData,
        phone,
      };

      //console.log("Request Log:", logData); // Log or save to database
      await userLogsModel.create(logData);
    }
  });
  // Proceed to the next middleware or route

  next();
};

export default SaveLogsDataOfuser;
