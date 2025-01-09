import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { userModel } from "../User/user.model";
import { TCoursesTime } from "./courseTime.interface";
import { courseTimesModel } from "./courseTime.model";
import { checkCourseTimeStatus } from "./courseTime.utils";

const createCourseTimeIntoDb = async (payload: TCoursesTime) => {
  payload.status = checkCourseTimeStatus(payload.startDate, payload.endDate);

  const result = await courseTimesModel.create(payload);
  return result;
};
//
// const updateCourseTimeIntoDb = async (
//   payload: Partial<TCoursesTime>,
//   courseId: string,
// ) => {
//   const user = await userModel.findById(payload.userId);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found!");
//   }

//   const updateCourse = await courseTimesModel.findByIdAndUpdate(
//     courseId,
//     {
//       isActive: payload.isActive,
//     },
//     {
//       new: true,
//     },
//   );
//   if (!updateCourse) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Faild to update course!");
//   }

//   return updateCourse;
// };
// delete CourseTime FromDB
const deleteCourseTimeFromDB = async (courseId: string) => {
  const deletedCourseTime = await courseTimesModel.findByIdAndDelete(courseId);
  if (!deletedCourseTime) {
    throw new AppError(httpStatus.BAD_REQUEST, "Faild To Delete Course Time");
  }

  return deletedCourseTime;
};

//
const getAllCourseTimeFromDbByUserId = async (userId: string) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const getCourseTimesByUserId = await courseTimesModel
    .find({
      userId,
    })
    .sort("-createdAt");

  // is there any courseTimes
  if (getCourseTimesByUserId && getCourseTimesByUserId.length > 0) {
    // store active course times
    const allOnGoingAndUpComingCourseTimes = [];
    // loop all got cours times
    for (const coursTimeEle of getCourseTimesByUserId) {
      if (coursTimeEle.status !== "ENDED") {
        allOnGoingAndUpComingCourseTimes.push(coursTimeEle);
      }
    }

    if (allOnGoingAndUpComingCourseTimes.length > 0) {
      for (const courseTimeEle of allOnGoingAndUpComingCourseTimes) {
        // is need to change course time status
        const updateStatus = checkCourseTimeStatus(
          courseTimeEle.startDate,
          courseTimeEle.endDate,
        );
        if (updateStatus !== courseTimeEle.status) {
          const updateCourseTimeStatus =
            await courseTimesModel.findByIdAndUpdate(courseTimeEle._id, {
              status: updateStatus,
            });
          if (!updateCourseTimeStatus) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              "Faild to update status of course Time!",
            );
          }
        }
      }
    }
  }

  const getUpateCourseTimesByUserId = await courseTimesModel
    .find({
      userId,
    })
    .sort("createdAt");

  return getUpateCourseTimesByUserId;
};

//
export const coursesTimeService = {
  createCourseTimeIntoDb,
  // updateCourseTimeIntoDb,
  deleteCourseTimeFromDB,
  getAllCourseTimeFromDbByUserId,
};
