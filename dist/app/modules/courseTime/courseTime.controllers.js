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
exports.coursesTimeControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const courseTime_service_1 = require("./courseTime.service");
// create Course Time
const createCourseTime = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdCourse = yield courseTime_service_1.coursesTimeService.createCourseTimeIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Course Time Created Successfully!",
        data: createdCourse,
    });
}));
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
const deleteCourseTime = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const deletedCourse = yield courseTime_service_1.coursesTimeService.deleteCourseTimeFromDB(courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Course Time Deleted Successfully!",
        data: deletedCourse,
    });
}));
// get all Course Time by userId
const getAllCourseTimesByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const courseTimes = yield courseTime_service_1.coursesTimeService.getAllCourseTimeFromDbByUserId(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Course Times Retrive Successfully!",
        data: courseTimes,
    });
}));
//
exports.coursesTimeControllers = {
    createCourseTime,
    // updateCourseTime,
    deleteCourseTime,
    getAllCourseTimesByUserId,
};
