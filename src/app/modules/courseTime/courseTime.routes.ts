import express from "express";
import auth from "../../../middlewares/auth";
import validateRequest from "../../../middlewares/validateRequest";
import { coursesTimeControllers } from "./courseTime.controllers";
import { coursesTimeValidationSchema } from "./courseTime.validation";

const router = express.Router();
// create course
router.post(
  "/",
  auth("Admin"),
  validateRequest(coursesTimeValidationSchema.createCoursesTime),
  coursesTimeControllers.createCourseTime,
);
// get all specific course by userId
router.get(
  "/:userId",
  auth("Admin", "Student"),
  coursesTimeControllers.getAllCourseTimesByUserId,
);
// update course
// router.patch(
//   "/:userId",
//   validateRequest(coursesTimeValidationSchema.createCoursesTime),
//   coursesTimeControllers.updateCourseTime,
// );
// delete course
router.delete(
  "/:courseId",
  auth("Admin"),
  coursesTimeControllers.deleteCourseTime,
);

export const courseTimeRoutes = router;
