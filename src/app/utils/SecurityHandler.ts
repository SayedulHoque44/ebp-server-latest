import { Request } from "express";
import { userModel } from "../modules/User/user.model";
import AppError from "../error/AppError";

const getForwardedIp = (req: Request) => {
  const forwarded = req?.headers["x-forwarded-for"];
  let forwardedIp: string;

  if (Array.isArray(forwarded)) {
    // If it's an array, take the first element
    forwardedIp = forwarded[0];
  } else if (typeof forwarded === "string") {
    // If it's a string, split it
    forwardedIp = forwarded.split(",")[0];
  } else {
    // Fallback to req.ip
    forwardedIp = "none";
  }

  return forwardedIp;
};

const CheckIpMatcher = async (req: Request, userId: string) => {
  // const user = await userModel.findOne({ _id: userId });
  // const forwardedIp = getForwardedIp(req);
  // if (
  //   user?.permissionIps.includes(forwardedIp) ||
  //   user?.permissionIps.includes("0.0.0.0")
  // ) {
  //   return true;
  // } else {
  //   throw new AppError(401, "Unauthorized user IP!");
  // }
};

const EnterUserLog = async (req: Request, userId: string) => {
  // const user = await userModel.findOne({ _id: userId });
  // const req_ip = req?.ip;
  // const userAgent = req?.headers["user-agent"];
  // for(let i = 0; i <user?.userInfo.length; i++){
  //     if(user.userInfo[i].req_ip === req_ip){
  //         return;
  //     }
  // }
  //   if (user?.role === "Admin") {
  //     await userModel.findByIdAndUpdate(userId, {
  //       $push: {
  //         userInfo: {
  //           req_ip,
  //           forwardedIp,
  //           userAgent,
  //         },
  //       },
  //     });
  //   }
};

export const SecurityHandler = {
  CheckIpMatcher,
  EnterUserLog,
};
