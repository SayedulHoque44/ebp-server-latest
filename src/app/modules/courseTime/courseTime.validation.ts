import { z } from "zod";

const createCoursesTime = z.object({
  body: z.object({
    userId: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    durationInMonths: z.number(),
  }),
});
const updateCoursesTime = z.object({
  body: z.object({
    userId: z.string(),
    isActive: z.boolean(),
  }),
});

//
export const coursesTimeValidationSchema = {
  createCoursesTime,
  updateCoursesTime,
};
