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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coursesTimeService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_model_1 = require("../User/user.model");
const courseTime_model_1 = require("./courseTime.model");
const courseTime_utils_1 = require("./courseTime.utils");
const createCourseTimeIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.status = (0, courseTime_utils_1.checkCourseTimeStatus)(payload.startDate, payload.endDate);
    const result = yield courseTime_model_1.courseTimesModel.create(payload);
    return result;
});
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
const deleteCourseTimeFromDB = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedCourseTime = yield courseTime_model_1.courseTimesModel.findByIdAndDelete(courseId);
    if (!deletedCourseTime) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Faild To Delete Course Time");
    }
    return deletedCourseTime;
});
//
const getAllCourseTimeFromDbByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User Not Found");
    }
    const getCourseTimesByUserId = yield courseTime_model_1.courseTimesModel
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
                const updateStatus = (0, courseTime_utils_1.checkCourseTimeStatus)(courseTimeEle.startDate, courseTimeEle.endDate);
                if (updateStatus !== courseTimeEle.status) {
                    const updateCourseTimeStatus = yield courseTime_model_1.courseTimesModel.findByIdAndUpdate(courseTimeEle._id, {
                        status: updateStatus,
                    });
                    if (!updateCourseTimeStatus) {
                        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Faild to update status of course Time!");
                    }
                }
            }
        }
    }
    const getUpateCourseTimesByUserId = yield courseTime_model_1.courseTimesModel
        .find({
        userId,
    })
        .sort("createdAt");
    return getUpateCourseTimesByUserId;
});
//
exports.coursesTimeService = {
    createCourseTimeIntoDb,
    // updateCourseTimeIntoDb,
    deleteCourseTimeFromDB,
    getAllCourseTimeFromDbByUserId,
};
