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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityHandler = void 0;
const getForwardedIp = (req) => {
    const forwarded = req === null || req === void 0 ? void 0 : req.headers["x-forwarded-for"];
    let forwardedIp;
    if (Array.isArray(forwarded)) {
        // If it's an array, take the first element
        forwardedIp = forwarded[0];
    }
    else if (typeof forwarded === "string") {
        // If it's a string, split it
        forwardedIp = forwarded.split(",")[0];
    }
    else {
        // Fallback to req.ip
        forwardedIp = "none";
    }
    return forwardedIp;
};
const CheckIpMatcher = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
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
});
const EnterUserLog = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.SecurityHandler = {
    CheckIpMatcher,
    EnterUserLog,
};
