import { Schema, model } from "mongoose";
import { userPaymentStatus, userRole, userStatus } from "./user.constant";
import { TDeviceLogin, Tuser, TUserLogs } from "./user.interface";

//  user DeviceLogin
const deviceLoginSchema = new Schema<TDeviceLogin>({
  deviceInfo: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  systemId: {
    type: String,
    required: true,
  },
  userIp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

// user Schema
const userSchema = new Schema<Tuser>(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
    },
    pin: {
      type: Number,
      required: true,
    },
    email: String,
    propileImageUrl: String,
    paymentStatus: {
      type: String,
      enum: userPaymentStatus,
      default: "unPaid",
    },
    status: {
      type: String,
      enum: userStatus,
      default: "Disabled",
    },
    role: {
      type: String,
      enum: userRole,
      default: "Student",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    group: {
      type: String,
      default: "Free",
    },
    note: String,
    paymantNote: String,
    deviceLogin: [deviceLoginSchema],
    logInAttempt: Number,
  },
  {
    timestamps: true,
  },
);

// UserLog Schema
const userLogSchema = new Schema<TUserLogs>(
  {
    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "DELETE", "PATCH", "UNKNOWN_METHOD"],
      default: "UNKNOWN_METHOD",
    },
    url: {
      type: String,
      default: "UNKNOWN_URL",
    },
    statusCode: {
      type: Number,
      default: 0,
    },
    ipAddress: {
      type: String,
      default: "UNKNOWN_IP",
    },
    userAgent: {
      type: String,
      default: "UNKNOWN_USER_AGENT",
    },
    responseTimeMs: {
      type: Number,
      default: 0,
    },
    systemId: {
      type: String,
      default: "UNKNOWN_SYSTEM",
    },
    userId: {
      type: String,
      default: "UNKNOWN_USER",
    },
    phone: {
      type: String,
      default: "UNKNOWN_PHONE",
    },
    clientReqData: {
      req: {
        type: Object,
        default: {},
      },
      query: {
        type: Object,
        default: {},
      },
      params: {
        type: Object,
        default: {},
      },
    },
    clientResData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);
//

export const userModel = model<Tuser>("User", userSchema);
export const userLogsModel = model<TUserLogs>("UserLog", userLogSchema);
