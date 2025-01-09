import { z } from "zod";
import { userPaymentStatus, userStatus } from "./user.constant";

//register user
const registerUser = z.object({
  body: z.object({
    name: z.string(),
    phone: z.string(),
    city: z.string(),
    pin: z.number(),
  }),
});
// login user
const loginUser = z.object({
  body: z.object({
    phone: z.string(),
    pin: z.number(),
    deviceInfo: z.string(),
  }),
});
// me
const meSchema = z.object({
  body: z.object({
    deviceInfo: z.string(),
  }),
});

//
// const updateUserCourseTime = z.object({
//   startDate: z.string(),
//   endDate: z.string().optional(),
//   durationInMonths: z.number().optional(),
//   isActive: z.boolean().optional(),
//   isDeleted: z.boolean().optional(),
// });
//
const updateUserSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
    pin: z.number().optional(),
    email: z.string().email().optional(),
    propileImageUrl: z.string().optional(),
    paymentStatus: z.enum(userPaymentStatus as [string, ...string[]]),
    status: z.enum(userStatus as [string, ...string[]]),
    // role: z.enum(userPaymentStatus as [string, ...string[]]),
    group: z.string().optional(), //"Free"
    note: z.string().optional(),
    paymantNote: z.string().optional(),
  }),
});

//
export const userValidationSchema = {
  registerUser,
  loginUser,
  meSchema,
  updateUserSchema,
};
