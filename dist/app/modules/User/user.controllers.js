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
exports.userControllers = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const AppError_1 = __importDefault(require("../../error/AppError"));
// user register
const userRegister = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const createdUser = yield user_service_1.userServices.registerUserIntoDB(userData);
    let resUser = createdUser;
    if (createdUser) {
        // Transform the user to include the student field and exclude paymentStatus
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const _a = createdUser.toObject(), { paymentStatus, paymantNote } = _a, userWithoutPaymentStatus = __rest(_a, ["paymentStatus", "paymantNote"]); // Exclude paymentStatus
        const transformedUser = Object.assign(Object.assign({}, userWithoutPaymentStatus), { student: paymentStatus === "paid" });
        resUser = transformedUser; // Return the transformed user
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Registerd Successfully!",
        data: resUser,
    });
}));
// user login
const userLogin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    userData.userIp = req.headers["x-forwarded-for"] || req.ip || "Not_Found_IP";
    userData.systemId = req.headers["x-system-id"] || "Not_Found_SystemId";
    const loggedUserWithToken = yield user_service_1.userServices.loginUser(userData);
    const { user, token } = loggedUserWithToken;
    const _b = user.toObject(), { paymentStatus, paymantNote } = _b, remainData = __rest(_b, ["paymentStatus", "paymantNote"]);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "login Successfully!",
        data: { token, user: Object.assign(Object.assign({}, remainData), { student: paymentStatus === "paid" }) },
    });
}));
// get me
const getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { deviceInfo } = req.body;
    const { phone } = req.user;
    const getUser = yield user_service_1.userServices.getMeFromDB(deviceInfo, phone);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "user retrive Successfully!",
        data: getUser,
    });
}));
// get me for app
const getMeForApp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { deviceInfo } = req.body;
    const { phone } = req.user;
    // const checkPay = (paymentStatus:string)=>{
    //   if(paymentStatus === "paid") {return true}
    //   return false
    // }
    const getUser = yield user_service_1.userServices.getMeFromDB(deviceInfo, phone);
    let resUser = getUser;
    if (getUser) {
        // Transform the user to include the student field and exclude paymentStatus
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const _c = getUser.toObject(), { paymentStatus, paymantNote } = _c, userWithoutPaymentStatus = __rest(_c, ["paymentStatus", "paymantNote"]); // Exclude paymentStatus
        const transformedUser = Object.assign(Object.assign({}, userWithoutPaymentStatus), { student: paymentStatus === "paid" });
        resUser = transformedUser; // Return the transformed user
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "user retrive Successfully!",
        data: resUser,
    });
}));
// get me
const getSingleUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const { phone, role } = req.user;
    const getUser = yield user_service_1.userServices.getSingleUserFromDB(userId, phone, role);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "user retrive Successfully!",
        data: getUser,
    });
}));
// get me
const updateSingleUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const decodedData = req.user;
    const userData = req.body;
    const getUser = yield user_service_1.userServices.updateSingleUserFromDB(userId, decodedData, userData);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "user update Successfully!",
        data: getUser,
    });
}));
// get all users
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getUser = yield user_service_1.userServices.getAllUserFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "users retrive Successfully!",
        data: getUser,
    });
}));
// delete all users login
const deleteAllUsersLogin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getUser = yield user_service_1.userServices.deleteAllUsersLoginFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "all user device logout Successfully!",
        data: getUser,
    });
}));
// get me
const deleteSingleUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (userId !== req.user.userId &&
        req.user.role !== "Admin") {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to delete this user!");
    }
    const getUser = yield user_service_1.userServices.deleteSingleUserFromDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "user Deleted Successfully!",
        data: getUser,
    });
}));
//
// get all users
const getUsersLogs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getUserLogs = yield user_service_1.userServices.getUsersLogsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User Logs retrive Successfully!",
        data: getUserLogs,
    });
}));
exports.userControllers = {
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
