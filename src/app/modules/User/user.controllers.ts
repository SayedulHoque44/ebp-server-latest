/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";
import AppError from "../../error/AppError";

// user register
const userRegister = catchAsync(async (req, res) => {
  const userData = req.body;
  const createdUser = await userServices.registerUserIntoDB(userData);
  let resUser: any = createdUser;
  if (createdUser) {
    // Transform the user to include the student field and exclude paymentStatus
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { paymentStatus, paymantNote, ...userWithoutPaymentStatus } =
      createdUser.toObject(); // Exclude paymentStatus
    const transformedUser = {
      ...userWithoutPaymentStatus, // Include all other fields
      student: paymentStatus === "paid", // Determine student field based on paymentStatus
    };
    resUser = transformedUser; // Return the transformed user
  }
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Registerd Successfully!",
    data: resUser,
  });
});

// user login
const userLogin = catchAsync(async (req, res) => {
  const userData = req.body;
  userData.userIp = req.headers["x-forwarded-for"] || req.ip || "Not_Found_IP";
  userData.systemId = req.headers["x-system-id"] || "Not_Found_SystemId";
  const loggedUserWithToken = await userServices.loginUser(userData);
  const { user, token } = loggedUserWithToken;
  const { paymentStatus, paymantNote, ...remainData } = (
    user as any
  ).toObject();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "login Successfully!",
    data: { token, user: { ...remainData, student: paymentStatus === "paid" } },
  });
});
// get me
const getMe = catchAsync(async (req, res) => {
  const { deviceInfo } = req.body;
  const { phone } = (req as any).user;

  const getUser = await userServices.getMeFromDB(deviceInfo, phone);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "user retrive Successfully!",
    data: getUser,
  });
});

// get me for app
const getMeForApp = catchAsync(async (req, res) => {
  const { deviceInfo } = req.body;
  const { phone } = (req as any).user;

  // const checkPay = (paymentStatus:string)=>{
  //   if(paymentStatus === "paid") {return true}
  //   return false

  // }

  const getUser = await userServices.getMeFromDB(deviceInfo, phone);
  let resUser: any = getUser;
  if (getUser) {
    // Transform the user to include the student field and exclude paymentStatus
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { paymentStatus, paymantNote, ...userWithoutPaymentStatus } =
      getUser.toObject(); // Exclude paymentStatus
    const transformedUser = {
      ...userWithoutPaymentStatus, // Include all other fields
      student: paymentStatus === "paid", // Determine student field based on paymentStatus
    };
    resUser = transformedUser; // Return the transformed user
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "user retrive Successfully!",
    data: resUser,
  });
});
// get me
const getSingleUserById = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const { phone, role } = (req as any).user;

  const getUser = await userServices.getSingleUserFromDB(userId, phone, role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "user retrive Successfully!",
    data: getUser,
  });
});
// get me
const updateSingleUserById = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const decodedData = (req as any).user;
  const userData = req.body;

  const getUser = await userServices.updateSingleUserFromDB(
    userId,
    decodedData,
    userData,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "user update Successfully!",
    data: getUser,
  });
});
// get all users
const getAllUsers = catchAsync(async (req, res) => {
  const getUser = await userServices.getAllUserFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "users retrive Successfully!",
    data: getUser,
  });
});
// delete all users login
const deleteAllUsersLogin = catchAsync(async (req, res) => {
  const getUser = await userServices.deleteAllUsersLoginFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "all user device logout Successfully!",
    data: getUser,
  });
});

// get me
const deleteSingleUserById = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  if (
    userId !== (req as any).user.userId &&
    (req as any).user.role !== "Admin"
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to delete this user!",
    );
  }

  const getUser = await userServices.deleteSingleUserFromDB(userId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "user Deleted Successfully!",
    data: getUser,
  });
});
//

// get all users
const getUsersLogs = catchAsync(async (req, res) => {
  const getUserLogs = await userServices.getUsersLogsFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Logs retrive Successfully!",
    data: getUserLogs,
  });
});
export const userControllers = {
  userRegister,
  userLogin,
  getMe,
  getSingleUserById,
  updateSingleUserById,
  getAllUsers,
  deleteSingleUserById,
  deleteAllUsersLogin,
  getMeForApp,
  getUsersLogs,
};
