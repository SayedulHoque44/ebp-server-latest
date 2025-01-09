import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { coursesTimeService } from "./courseTime.service";

// create Course Time
const createCourseTime = catchAsync(async (req, res) => {
  const createdCourse = await coursesTimeService.createCourseTimeIntoDb(
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course Time Created Successfully!",
    data: createdCourse,
  });
});
// update Course Time
// const updateCourseTime = catchAsync(async (req, res) => {
//   const { courseId } = req.params;
//   const updatedCourse = await coursesTimeService.updateCourseTimeIntoDb(
//     req.body,
//     courseId,
//   );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Course Time updated Successfully!",
//     data: updatedCourse,
//   });
// });
// delete Course Time
const deleteCourseTime = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const deletedCourse =
    await coursesTimeService.deleteCourseTimeFromDB(courseId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course Time Deleted Successfully!",
    data: deletedCourse,
  });
});
// get all Course Time by userId
const getAllCourseTimesByUserId = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const courseTimes =
    await coursesTimeService.getAllCourseTimeFromDbByUserId(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course Times Retrive Successfully!",
    data: courseTimes,
  });
});

//
export const coursesTimeControllers = {
  createCourseTime,
  // updateCourseTime,
  deleteCourseTime,
  getAllCourseTimesByUserId,
};
