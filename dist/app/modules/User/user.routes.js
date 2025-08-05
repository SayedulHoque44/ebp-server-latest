"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const user_controllers_1 = require("./user.controllers");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
// register user
router.post("/register", 
// ConfigLimiter.auth,
(0, validateRequest_1.default)(user_validation_1.userValidationSchema.registerUser), user_controllers_1.userControllers.userRegister);
// login user
router.post("/login", 
// ConfigLimiter.auth,
(0, validateRequest_1.default)(user_validation_1.userValidationSchema.loginUser), user_controllers_1.userControllers.userLogin);
// getMe
router.post("/getMe", (0, auth_1.default)("Admin", "Student"), (0, validateRequest_1.default)(user_validation_1.userValidationSchema.meSchema), user_controllers_1.userControllers.getMe);
// getMe
router.post("/app/getMe", (0, auth_1.default)("Admin", "Student"), (0, validateRequest_1.default)(user_validation_1.userValidationSchema.meSchema), user_controllers_1.userControllers.getMeForApp);
//get single user by id
router.get("/:userId", (0, auth_1.default)("Student", "Admin"), user_controllers_1.userControllers.getSingleUserById);
//update single user by id
router.patch("/:userId", (0, auth_1.default)("Student", "Admin"), 
// validateRequest(userValidationSchema.updateUserSchema),
user_controllers_1.userControllers.updateSingleUserById);
//delete single user by id
router.delete("/:userId", (0, auth_1.default)("Admin", "Student"), user_controllers_1.userControllers.deleteSingleUserById);
// get all users
router.get("/", (0, auth_1.default)("Admin"), user_controllers_1.userControllers.getAllUsers);
//
router.get("/get/logs", user_controllers_1.userControllers.getUsersLogs);
// delete all users login
router.patch("/device/deleteDevices", (0, auth_1.default)("Admin"), user_controllers_1.userControllers.deleteAllUsersLogin);
// Get User Logs
//
exports.userRoutes = router;
