"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coursesTimeValidationSchema = void 0;
const zod_1 = require("zod");
const createCoursesTime = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string(),
        startDate: zod_1.z.string(),
        endDate: zod_1.z.string(),
        durationInMonths: zod_1.z.number(),
    }),
});
const updateCoursesTime = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string(),
        isActive: zod_1.z.boolean(),
    }),
});
//
exports.coursesTimeValidationSchema = {
    createCoursesTime,
    updateCoursesTime,
};
