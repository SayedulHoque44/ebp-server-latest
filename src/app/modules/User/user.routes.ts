import express from "express";
import auth from "../../../middlewares/auth";
import validateRequest from "../../../middlewares/validateRequest";
import { userControllers } from "./user.controllers";
import { userValidationSchema } from "./user.validation";

const router = express.Router();

// register user
router.post(
  "/register",
  validateRequest(userValidationSchema.registerUser),
  userControllers.userRegister,
);
// login user
router.post(
  "/login",
  validateRequest(userValidationSchema.loginUser),
  userControllers.userLogin,
);
// getMe
router.post(
  "/getMe",
  auth("Admin", "Student"),
  validateRequest(userValidationSchema.meSchema),
  userControllers.getMe,
);
// getMe
router.post(
  "/app/getMe",
  auth("Admin", "Student"),
  validateRequest(userValidationSchema.meSchema),
  userControllers.getMeForApp,
);
//get single user by id
router.get(
  "/:userId",
  auth("Student", "Admin"),
  userControllers.getSingleUserById,
);
//update single user by id
router.patch(
  "/:userId",
  auth("Student", "Admin"),
  // validateRequest(userValidationSchema.updateUserSchema),
  userControllers.updateSingleUserById,
);
//delete single user by id
router.delete(
  "/:userId",
  auth("Admin", "Student"),
  userControllers.deleteSingleUserById,
);
// get all users
router.get("/", auth("Admin"), userControllers.getAllUsers);
// delete all users login
router.patch(
  "/device/deleteDevices",
  auth("Admin"),
  userControllers.deleteAllUsersLogin,
);

//
export const userRoutes = router;
