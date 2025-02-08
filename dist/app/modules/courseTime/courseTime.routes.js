"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseTimeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const courseTime_controllers_1 = require("./courseTime.controllers");
const courseTime_validation_1 = require("./courseTime.validation");
const router = express_1.default.Router();
// create course
router.post("/", (0, auth_1.default)("Admin"), (0, validateRequest_1.default)(courseTime_validation_1.coursesTimeValidationSchema.createCoursesTime), courseTime_controllers_1.coursesTimeControllers.createCourseTime);
// get all specific course by userId
router.get("/:userId", (0, auth_1.default)("Admin", "Student"), courseTime_controllers_1.coursesTimeControllers.getAllCourseTimesByUserId);
// update course
// router.patch(
//   "/:userId",
//   validateRequest(coursesTimeValidationSchema.createCoursesTime),
//   coursesTimeControllers.updateCourseTime,
// );
// delete course
router.delete("/:courseId", (0, auth_1.default)("Admin"), courseTime_controllers_1.coursesTimeControllers.deleteCourseTime);
exports.courseTimeRoutes = router;
