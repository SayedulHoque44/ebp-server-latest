import { Schema, model } from "mongoose";
import { userPaymentStatus, userRole, userStatus } from "./user.constant";
import { TDeviceLogin, Tuser } from "./user.interface";

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

//
export const userModel = model<Tuser>("User", userSchema);
