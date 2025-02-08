"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationSchema = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
//register user
const registerUser = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        phone: zod_1.z.string(),
        city: zod_1.z.string(),
        pin: zod_1.z.number(),
    }),
});
// login user
const loginUser = zod_1.z.object({
    body: zod_1.z.object({
        phone: zod_1.z.string(),
        pin: zod_1.z.number(),
        deviceInfo: zod_1.z.string(),
    }),
});
// me
const meSchema = zod_1.z.object({
    body: zod_1.z.object({
        deviceInfo: zod_1.z.string(),
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
const updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        pin: zod_1.z.number().optional(),
        email: zod_1.z.string().email().optional(),
        propileImageUrl: zod_1.z.string().optional(),
        paymentStatus: zod_1.z.enum(user_constant_1.userPaymentStatus),
        status: zod_1.z.enum(user_constant_1.userStatus),
        // role: z.enum(userPaymentStatus as [string, ...string[]]),
        group: zod_1.z.string().optional(), //"Free"
        note: zod_1.z.string().optional(),
        paymantNote: zod_1.z.string().optional(),
    }),
});
//
exports.userValidationSchema = {
    registerUser,
    loginUser,
    meSchema,
    updateUserSchema,
};
