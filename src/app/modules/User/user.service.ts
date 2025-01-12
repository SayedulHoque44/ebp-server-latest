import httpStatus from "http-status";
import Jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import QueryBuilder from "../../../builder/QueryBuilder";
import config from "../../config";
import AppError from "../../error/AppError";
import { courseTimesModel } from "../courseTime/courseTime.model";
import { coursesTimeService } from "../courseTime/courseTime.service";
import { UserSearchFields } from "./user.constant";
import { TLoginuser, Tuser } from "./user.interface";
import { userLogsModel, userModel } from "./user.model";
import { checkSameDeviceFound } from "./user.utils";

// register a user
const registerUserIntoDB = async (payload: Tuser) => {
  // remove extra space
  const phone = payload.phone;
  const withOutSpacePhone = phone.replace(/\s/g, "");
  payload.phone = withOutSpacePhone;
  //
  // if there any exiting phone
  const existingUser = await userModel.findOne({
    phone: payload.phone,
  });

  if (existingUser) {
    if (existingUser.isDeleted) {
      // if user is soft deleted
      const updateUser = await userModel.findByIdAndUpdate(existingUser._id, {
        ...payload,
        isDeleted: false,
      });
      return updateUser;
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `${existingUser.phone} is already exits!`,
      );
    }
  }
  // check register limit
  // Calculate the start time of the last 24 hours
  const last24Hours = new Date(); //current time

  last24Hours.setHours(last24Hours.getHours() - 24); //24h fallback from current time

  // Count registrations within the last 24 hours
  const registrationCount = await userModel.countDocuments({
    createdAt: { $gte: last24Hours },
  });

  // Check if the registration limit is reached
  if (registrationCount >= 20) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Registration limit exceeded for today. Please try again later.",
    );
  }
  //
  const user = await userModel.create(payload);
  return user;
};
// loginUser
const loginUser = async (payload: TLoginuser) => {
  const deviceLoginInfo: Partial<TLoginuser> = {};
  deviceLoginInfo.deviceInfo = payload?.deviceInfo;
  deviceLoginInfo.systemId = payload?.systemId;
  deviceLoginInfo.userIp = payload?.userIp;
  // remove extra space
  const phone = payload.phone;
  const withOutSpacePhone = phone.replace(/\s/g, "");
  payload.phone = withOutSpacePhone;
  //
  const user = await userModel.findOne({
    phone: payload.phone,
    isDeleted: false,
  });
  // check user exits
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "ইউজার পাওয়া যায়নি,আপনার নাম্বার আবার চেক করুন।",
    );
  }
  // check pass
  if (payload.pin !== user.pin) {
    throw new AppError(httpStatus.BAD_REQUEST, "পিন সঠিক নয়,আবার চেষ্টা করুন।");
  }
  // check is blocked
  if (user.status === "Block") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Unable to Login. Try Again Later!",
    );
  }
  // device check -->
  const allDevices = user?.deviceLogin;
  // is there any deviceLogged in
  if (allDevices && allDevices.length > 0) {
    // check current device found in any previous logged devices
    const sameDevice = checkSameDeviceFound(allDevices, payload.deviceInfo);

    // device not found -> new device
    if (!sameDevice) {
      // only 2 device login permission
      if (allDevices.length >= 4) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "আপনি সর্বোচ্চ ২ টি ডিভাইসে লগ-ইন করতে পারবেন❌",
        );
      }
      // update new device info
      const newUserDevice = await userModel.findByIdAndUpdate(user.id, {
        $addToSet: {
          deviceLogin: [deviceLoginInfo],
        },
      });
      //
      if (!newUserDevice) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "নতুন ডিভাইস আপডেট করা হয়নি,আবার চেষ্টা করুন।",
        );
      }
    }
  } else {
    // new Login with no logged device
    // update new device info
    const newUserDevice = await userModel.findByIdAndUpdate(user.id, {
      $addToSet: {
        deviceLogin: [deviceLoginInfo],
      },
    });
    //
    if (!newUserDevice) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "নতুন ডিভাইস আপডেট করা হয়নি,আবার চেষ্টা করুন।",
      );
    }
  }

  const jwtPayload = {
    userId: user._id,
    phone: user.phone,
    role: user.role,
  };
  const token = Jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  });

  // check token created successfully
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Somthing Wrong");
  }
  // loginAttempt
  const logInAttempt = user.logInAttempt || 0;
  const updatedUser = await userModel.findByIdAndUpdate(
    user._id,
    {
      logInAttempt: logInAttempt + 1,
    },
    { new: true },
  );

  return { user: updatedUser, token };
};

// getMe from DB
const getMeFromDB = async (deviceInfo: string, phone: string) => {
  const user = await userModel.findOne({
    phone: phone,
    deviceLogin: {
      $elemMatch: {
        deviceInfo: deviceInfo,
      },
    },
    isDeleted: false,
  });
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "user not found!");
  }
  if ((user as any).status === "Block") {
    throw new AppError(httpStatus.UNAUTHORIZED, "You Have Been Blocked!");
  }

  if (user.role !== "Admin" && user.status !== "Passed") {
    // Its a Student & not passed -> update user disable to active or disabled to active based on course
    const onGoingCoureTime = [];
    const userId = user._id.toString();
    const manipulateCourseTimesAndGetAllCourseByUserId =
      await coursesTimeService.getAllCourseTimeFromDbByUserId(userId);

    // all times
    if (manipulateCourseTimesAndGetAllCourseByUserId.length > 0) {
      const isAnyOngoingCourseTime =
        manipulateCourseTimesAndGetAllCourseByUserId.find(
          courseTimeEle => courseTimeEle.status === "ONGOING",
        );

      // if there onGoin course started
      // console.log(isAnyOngoingCourseTime);
      if (isAnyOngoingCourseTime) {
        onGoingCoureTime.push(isAnyOngoingCourseTime);
        // is user not active
        if (user.status !== "Block" && user.status === "Disabled") {
          // update user to active
          const updateUserToActive = await userModel.findByIdAndUpdate(
            user._id,
            {
              status: "Active",
            },
            { new: true },
          );
          if (!updateUserToActive) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              "Faild to upldate user status",
            );
          }
        }
      } else {
        // check is user active though there no ongoing course
        if (user.status !== "Block" && user.status === "Active") {
          // update user to Disabled
          const updateUserToActive = await userModel.findByIdAndUpdate(
            user._id,
            {
              status: "Disabled",
            },
            { new: true },
          );
          if (!updateUserToActive) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              "Faild to upldate user status",
            );
          }
        }
      }
    } else {
      // there not any courseTime
      if (user.status !== "Block" && user.status === "Active") {
        // update user to Disabled
        const updateUserToActive = await userModel.findByIdAndUpdate(
          user._id,
          {
            status: "Disabled",
          },
          { new: true },
        );
        if (!updateUserToActive) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "Faild to upldate user status",
          );
        }
      }
    }

    const getUpdateUser = await userModel.findById(user._id);
    return getUpdateUser;
  } else if (user.role !== "Admin" && user.status === "Passed") {
    // Its a passed student
    const userId = user._id.toString();
    const manipulateCourseTimesAndGetAllCourseByUserId =
      await coursesTimeService.getAllCourseTimeFromDbByUserId(userId);
    //
    if (!manipulateCourseTimesAndGetAllCourseByUserId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Faild to manipulate course");
    }
    return user;
  } else {
    // Its a Admin
    return user;
  }
};
// getMe from DB
const getMeFromDBForApp = async (deviceInfo: string, phone: string) => {
  const user = await userModel.findOne({
    phone: phone,
    deviceLogin: {
      $elemMatch: {
        deviceInfo: deviceInfo,
      },
    },
  });
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "user not found!");
  }
  if ((user as any).status === "Block") {
    throw new AppError(httpStatus.UNAUTHORIZED, "You Have Been Blocked!");
  }

  if (user.role !== "Admin" && user.status !== "Passed") {
    // Its a Student & not passed -> update user disable to active or disabled to active based on course
    const onGoingCoureTime = [];
    const userId = user._id.toString();
    const manipulateCourseTimesAndGetAllCourseByUserId =
      await coursesTimeService.getAllCourseTimeFromDbByUserId(userId);

    // all times
    if (manipulateCourseTimesAndGetAllCourseByUserId.length > 0) {
      const isAnyOngoingCourseTime =
        manipulateCourseTimesAndGetAllCourseByUserId.find(
          courseTimeEle => courseTimeEle.status === "ONGOING",
        );

      // if there onGoin course started
      // console.log(isAnyOngoingCourseTime);
      if (isAnyOngoingCourseTime) {
        onGoingCoureTime.push(isAnyOngoingCourseTime);
        // is user not active
        if (user.status !== "Block" && user.status === "Disabled") {
          // update user to active
          const updateUserToActive = await userModel.findByIdAndUpdate(
            user._id,
            {
              status: "Active",
            },
            { new: true },
          );
          if (!updateUserToActive) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              "Faild to upldate user status",
            );
          }
        }
      } else {
        // check is user active though there no ongoing course
        if (user.status !== "Block" && user.status === "Active") {
          // update user to Disabled
          const updateUserToActive = await userModel.findByIdAndUpdate(
            user._id,
            {
              status: "Disabled",
            },
            { new: true },
          );
          if (!updateUserToActive) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              "Faild to upldate user status",
            );
          }
        }
      }
    } else {
      // there not any courseTime
      if (user.status !== "Block" && user.status === "Active") {
        // update user to Disabled
        const updateUserToActive = await userModel.findByIdAndUpdate(
          user._id,
          {
            status: "Disabled",
          },
          { new: true },
        );
        if (!updateUserToActive) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "Faild to upldate user status",
          );
        }
      }
    }

    const getUpdateUser = await userModel.findById(user._id);
    return getUpdateUser;
  } else if (user.role !== "Admin" && user.status === "Passed") {
    // Its a passed student
    const userId = user._id.toString();
    const manipulateCourseTimesAndGetAllCourseByUserId =
      await coursesTimeService.getAllCourseTimeFromDbByUserId(userId);
    //
    if (!manipulateCourseTimesAndGetAllCourseByUserId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Faild to manipulate course");
    }
    return user;
  } else {
    // Its a Admin
    return user;
  }
};

// get single user by id from db
const getSingleUserFromDB = async (id: string, phone: string, role: string) => {
  const user = await userModel.findById(id).lean();

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "user not found!");
  }
  if (role !== "Admin") {
    // its Student
    if (user.phone !== phone) {
      throw new AppError(httpStatus.UNAUTHORIZED, "you are not authorised");
    }
  }
  //
  let courseTimes;
  if (user.role !== "Admin") {
    courseTimes = await courseTimesModel.find({
      userId: id,
    });
  }
  // get courseTime

  return { ...user, courseTimes };
};
// get single user by id from db
const updateSingleUserFromDB = async (
  id: string,
  decodedData: JwtPayload,
  payload: Partial<Tuser>,
) => {
  const user = await userModel.findById(id);
  // check user found
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found!");
  }
  // check user role and userHimSelf
  if (decodedData.role !== "Admin") {
    if (user.phone !== decodedData.phone) {
      throw new AppError(httpStatus.UNAUTHORIZED, "you are not authorised");
    }
  }

  const { deviceLogin, ...remainingData } = payload;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // update premitive data --> transaction -1
    const updateRemainigData = await userModel.findByIdAndUpdate(
      id,
      remainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );
    if (!updateRemainigData) {
      throw new AppError(httpStatus.BAD_REQUEST, "Faild to update user!");
    }
    // update non premitive data //------->
    if (deviceLogin && deviceLogin.length > 0) {
      // find deleted element
      const deletedDeviceLogins = deviceLogin
        .filter(ele => (ele as any).deviceInfo && ele.isDeleted)
        .map(ele => (ele as any).deviceInfo);
      //   // --> transaction -2
      const deleteDeviceFromDb = await userModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            deviceLogin: {
              deviceInfo: {
                $in: deletedDeviceLogins,
              },
            },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!deleteDeviceFromDb) {
        throw new AppError(httpStatus.BAD_REQUEST, "Faild to update user!");
      }
    }
    // update non premitive data //------->
    // if (coursesTime && coursesTime.length > 0) {
    //   // find deleted element
    //   const addCoursTime = coursesTime.filter(
    //     ele => ele.startDate && !ele.isDeleted,
    //   );
    //   // console.log(addCoursTime);
    //   //   // --> transaction - 3
    //   const addCoursTimeIntoDb = await userModel.findByIdAndUpdate(
    //     id,
    //     {
    //       $addToSet: {
    //         coursesTime: {
    //           $each: addCoursTime,
    //         },
    //       },
    //     },
    //     {
    //       new: true,
    //       runValidators: true,
    //       session,
    //     },
    //   );
    //   if (!addCoursTimeIntoDb) {
    //     throw new AppError(httpStatus.BAD_REQUEST, "Faild to update user!");
    //   }
    // }

    await session.commitTransaction();
    await session.endSession();

    const updateUser = await userModel.findById(id);
    return updateUser;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error);
  }
};
// get single user by id from db
const getAllUserFromDB = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(userModel.find(), query)
    .search(UserSearchFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await users.countTotal();
  const result = await users.modelQuery;

  return {
    meta,
    result,
  };
};
const getUsersLogsFromDB = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(userLogsModel.find(), query)
    .search(UserSearchFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await users.countTotal();
  const result = await users.modelQuery;

  return {
    meta,
    result,
  };
};

// get single user by id from db
const deleteSingleUserFromDB = async (id: string) => {
  const user = await userModel.findById(id);
  // check user found
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found!");
  }
  //
  const deleteUser = await userModel.findByIdAndUpdate(id, {
    isDeleted: true,
  });
  if (!deleteUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Faild to delete user !");
  }

  return null;
};

// delete all users device
const deleteAllUsersLoginFromDB = async () => {
  const users = await userModel.updateMany({
    deviceLogin: [],
  });
  return users;
};
// export
export const userServices = {
  registerUserIntoDB,
  loginUser,
  getMeFromDB,
  getSingleUserFromDB,
  updateSingleUserFromDB,
  getAllUserFromDB,
  deleteSingleUserFromDB,
  deleteAllUsersLoginFromDB,
  getMeFromDBForApp,
  getUsersLogsFromDB,
};
