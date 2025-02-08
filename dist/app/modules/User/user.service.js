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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const courseTime_model_1 = require("../courseTime/courseTime.model");
const courseTime_service_1 = require("../courseTime/courseTime.service");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const user_utils_1 = require("./user.utils");
// register a user
const registerUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // remove extra space
    const phone = payload.phone;
    const withOutSpacePhone = phone.replace(/\s/g, "");
    payload.phone = withOutSpacePhone;
    //
    // if there any exiting phone
    const existingUser = yield user_model_1.userModel.findOne({
        phone: payload.phone,
    });
    if (existingUser) {
        if (existingUser.isDeleted) {
            // if user is soft deleted
            const updateUser = yield user_model_1.userModel.findByIdAndUpdate(existingUser._id, Object.assign(Object.assign({}, payload), { isDeleted: false, createdAt: new Date() }));
            return updateUser;
        }
        else {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `${existingUser.phone} is already exits!`);
        }
    }
    // check register limit
    // Calculate the start time of the last 24 hours
    const last24Hours = new Date(); //current time
    last24Hours.setHours(last24Hours.getHours() - 24); //24h fallback from current time
    // Count registrations within the last 24 hours
    const registrationCount = yield user_model_1.userModel.countDocuments({
        createdAt: { $gte: last24Hours },
    });
    // Check if the registration limit is reached
    if (registrationCount >= 20) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Registration limit exceeded for today. Please try again later.");
    }
    //
    const user = yield user_model_1.userModel.create(payload);
    return user;
});
// loginUser
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceLoginInfo = {};
    deviceLoginInfo.deviceInfo = payload === null || payload === void 0 ? void 0 : payload.deviceInfo;
    deviceLoginInfo.systemId = payload === null || payload === void 0 ? void 0 : payload.systemId;
    deviceLoginInfo.userIp = payload === null || payload === void 0 ? void 0 : payload.userIp;
    // remove extra space
    const phone = payload.phone;
    const withOutSpacePhone = phone.replace(/\s/g, "");
    payload.phone = withOutSpacePhone;
    //
    const user = yield user_model_1.userModel.findOne({
        phone: payload.phone,
        isDeleted: false,
    });
    // check user exits
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "ইউজার পাওয়া যায়নি,আপনার নাম্বার আবার চেক করুন।");
    }
    // check pass
    if (payload.pin !== user.pin) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "পিন সঠিক নয়,আবার চেষ্টা করুন।");
    }
    // check is blocked
    if (user.status === "Block") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Unable to Login. Try Again Later!");
    }
    // device check -->
    const allDevices = user === null || user === void 0 ? void 0 : user.deviceLogin;
    // is there any deviceLogged in
    if (allDevices && allDevices.length > 0) {
        // check current device found in any previous logged devices
        const sameDevice = (0, user_utils_1.checkSameDeviceFound)(allDevices, payload.deviceInfo);
        // device not found -> new device
        if (!sameDevice) {
            // only 2 device login permission
            if (allDevices.length >= 4) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "আপনি সর্বোচ্চ ২ টি ডিভাইসে লগ-ইন করতে পারবেন❌");
            }
            // update new device info
            const newUserDevice = yield user_model_1.userModel.findByIdAndUpdate(user.id, {
                $addToSet: {
                    deviceLogin: [deviceLoginInfo],
                },
            });
            //
            if (!newUserDevice) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "নতুন ডিভাইস আপডেট করা হয়নি,আবার চেষ্টা করুন।");
            }
        }
    }
    else {
        // new Login with no logged device
        // update new device info
        const newUserDevice = yield user_model_1.userModel.findByIdAndUpdate(user.id, {
            $addToSet: {
                deviceLogin: [deviceLoginInfo],
            },
        });
        //
        if (!newUserDevice) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "নতুন ডিভাইস আপডেট করা হয়নি,আবার চেষ্টা করুন।");
        }
    }
    const jwtPayload = {
        userId: user._id,
        phone: user.phone,
        role: user.role,
    };
    const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: config_1.default.jwt_access_expires_in,
    });
    // check token created successfully
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Somthing Wrong");
    }
    // loginAttempt
    const logInAttempt = user.logInAttempt || 0;
    const updatedUser = yield user_model_1.userModel.findByIdAndUpdate(user._id, {
        logInAttempt: logInAttempt + 1,
    }, { new: true });
    return { user: updatedUser, token };
});
// getMe from DB
const getMeFromDB = (deviceInfo, phone) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findOne({
        phone: phone,
        deviceLogin: {
            $elemMatch: {
                deviceInfo: deviceInfo,
            },
        },
        isDeleted: false,
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "user not found!");
    }
    if (user.status === "Block") {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You Have Been Blocked!");
    }
    if (user.role !== "Admin" && user.status !== "Passed") {
        // Its a Student & not passed -> update user disable to active or disabled to active based on course
        const onGoingCoureTime = [];
        const userId = user._id.toString();
        const manipulateCourseTimesAndGetAllCourseByUserId = yield courseTime_service_1.coursesTimeService.getAllCourseTimeFromDbByUserId(userId);
        // all times
        if (manipulateCourseTimesAndGetAllCourseByUserId.length > 0) {
            const isAnyOngoingCourseTime = manipulateCourseTimesAndGetAllCourseByUserId.find(courseTimeEle => courseTimeEle.status === "ONGOING");
            // if there onGoin course started
            // console.log(isAnyOngoingCourseTime);
            if (isAnyOngoingCourseTime) {
                onGoingCoureTime.push(isAnyOngoingCourseTime);
                // is user not active
                if (user.status !== "Block" && user.status === "Disabled") {
                    // update user to active
                    const updateUserToActive = yield user_model_1.userModel.findByIdAndUpdate(user._id, {
                        status: "Active",
                    }, { new: true });
                    if (!updateUserToActive) {
                        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Faild to upldate user status");
                    }
                }
            }
            else {
                // check is user active though there no ongoing course
                if (user.status !== "Block" && user.status === "Active") {
                    // update user to Disabled
                    const updateUserToActive = yield user_model_1.userModel.findByIdAndUpdate(user._id, {
                        status: "Disabled",
                    }, { new: true });
                    if (!updateUserToActive) {
                        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Faild to upldate user status");
                    }
                }
            }
        }
        else {
            // there not any courseTime
            if (user.status !== "Block" && user.status === "Active") {
                // update user to Disabled
                const updateUserToActive = yield user_model_1.userModel.findByIdAndUpdate(user._id, {
                    status: "Disabled",
                }, { new: true });
                if (!updateUserToActive) {
                    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Faild to upldate user status");
                }
            }
        }
        const getUpdateUser = yield user_model_1.userModel.findById(user._id);
        return getUpdateUser;
    }
    else if (user.role !== "Admin" && user.status === "Passed") {
        // Its a passed student
        const userId = user._id.toString();
        const manipulateCourseTimesAndGetAllCourseByUserId = yield courseTime_service_1.coursesTimeService.getAllCourseTimeFromDbByUserId(userId);
        //
        if (!manipulateCourseTimesAndGetAllCourseByUserId) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Faild to manipulate course");
        }
        return user;
    }
    else {
        // Its a Admin
        return user;
    }
});
// getMe from DB
const getMeFromDBForApp = (deviceInfo, phone) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findOne({
        phone: phone,
        deviceLogin: {
            $elemMatch: {
                deviceInfo: deviceInfo,
            },
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "user not found!");
    }
    if (user.status === "Block") {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You Have Been Blocked!");
    }
    if (user.role !== "Admin" && user.status !== "Passed") {
        // Its a Student & not passed -> update user disable to active or disabled to active based on course
        const onGoingCoureTime = [];
        const userId = user._id.toString();
        const manipulateCourseTimesAndGetAllCourseByUserId = yield courseTime_service_1.coursesTimeService.getAllCourseTimeFromDbByUserId(userId);
        // all times
        if (manipulateCourseTimesAndGetAllCourseByUserId.length > 0) {
            const isAnyOngoingCourseTime = manipulateCourseTimesAndGetAllCourseByUserId.find(courseTimeEle => courseTimeEle.status === "ONGOING");
            // if there onGoin course started
            // console.log(isAnyOngoingCourseTime);
            if (isAnyOngoingCourseTime) {
                onGoingCoureTime.push(isAnyOngoingCourseTime);
                // is user not active
                if (user.status !== "Block" && user.status === "Disabled") {
                    // update user to active
                    const updateUserToActive = yield user_model_1.userModel.findByIdAndUpdate(user._id, {
                        status: "Active",
                    }, { new: true });
                    if (!updateUserToActive) {
                        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Faild to upldate user status");
                    }
                }
            }
            else {
                // check is user active though there no ongoing course
                if (user.status !== "Block" && user.status === "Active") {
                    // update user to Disabled
                    const updateUserToActive = yield user_model_1.userModel.findByIdAndUpdate(user._id, {
                        status: "Disabled",
                    }, { new: true });
                    if (!updateUserToActive) {
                        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Faild to upldate user status");
                    }
                }
            }
        }
        else {
            // there not any courseTime
            if (user.status !== "Block" && user.status === "Active") {
                // update user to Disabled
                const updateUserToActive = yield user_model_1.userModel.findByIdAndUpdate(user._id, {
                    status: "Disabled",
                }, { new: true });
                if (!updateUserToActive) {
                    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Faild to upldate user status");
                }
            }
        }
        const getUpdateUser = yield user_model_1.userModel.findById(user._id);
        return getUpdateUser;
    }
    else if (user.role !== "Admin" && user.status === "Passed") {
        // Its a passed student
        const userId = user._id.toString();
        const manipulateCourseTimesAndGetAllCourseByUserId = yield courseTime_service_1.coursesTimeService.getAllCourseTimeFromDbByUserId(userId);
        //
        if (!manipulateCourseTimesAndGetAllCourseByUserId) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Faild to manipulate course");
        }
        return user;
    }
    else {
        // Its a Admin
        return user;
    }
});
// get single user by id from db
const getSingleUserFromDB = (id, phone, role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findById(id).lean();
    if (!user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "user not found!");
    }
    if (role !== "Admin") {
        // its Student
        if (user.phone !== phone) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "you are not authorised");
        }
    }
    //
    let courseTimes;
    if (user.role !== "Admin") {
        courseTimes = yield courseTime_model_1.courseTimesModel.find({
            userId: id,
        });
    }
    // get courseTime
    return Object.assign(Object.assign({}, user), { courseTimes });
});
// get single user by id from db
const updateSingleUserFromDB = (id, decodedData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findById(id);
    // check user found
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "user not found!");
    }
    // check user role and userHimSelf
    if (decodedData.role !== "Admin") {
        if (user.phone !== decodedData.phone) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "you are not authorised");
        }
    }
    const { deviceLogin } = payload, remainingData = __rest(payload, ["deviceLogin"]);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // update premitive data --> transaction -1
        const updateRemainigData = yield user_model_1.userModel.findByIdAndUpdate(id, remainingData, {
            new: true,
            runValidators: true,
            session,
        });
        if (!updateRemainigData) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Faild to update user!");
        }
        // update non premitive data //------->
        if (deviceLogin && deviceLogin.length > 0) {
            // find deleted element
            const deletedDeviceLogins = deviceLogin
                .filter(ele => ele.deviceInfo && ele.isDeleted)
                .map(ele => ele.deviceInfo);
            //   // --> transaction -2
            const deleteDeviceFromDb = yield user_model_1.userModel.findByIdAndUpdate(id, {
                $pull: {
                    deviceLogin: {
                        deviceInfo: {
                            $in: deletedDeviceLogins,
                        },
                    },
                },
            }, {
                new: true,
                runValidators: true,
                session,
            });
            if (!deleteDeviceFromDb) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Faild to update user!");
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
        yield session.commitTransaction();
        yield session.endSession();
        const updateUser = yield user_model_1.userModel.findById(id);
        return updateUser;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, error);
    }
});
// get single user by id from db
const getAllUserFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const users = new QueryBuilder_1.default(user_model_1.userModel.find(), query)
        .search(user_constant_1.UserSearchFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield users.countTotal();
    const result = yield users.modelQuery;
    return {
        meta,
        result,
    };
});
const getUsersLogsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const users = new QueryBuilder_1.default(user_model_1.userLogsModel.find(), query)
        .search(user_constant_1.UserSearchFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield users.countTotal();
    const result = yield users.modelQuery;
    return {
        meta,
        result,
    };
});
// get single user by id from db
const deleteSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findById(id);
    // check user found
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "user not found!");
    }
    //
    const deleteUser = yield user_model_1.userModel.findByIdAndUpdate(id, {
        isDeleted: true,
        deviceLogin: [],
        paymentStatus: "unPaid",
    });
    if (!deleteUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Faild to delete user !");
    }
    return null;
});
// delete all users device
const deleteAllUsersLoginFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.userModel.updateMany({
        deviceLogin: [],
    });
    return users;
});
// export
exports.userServices = {
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
