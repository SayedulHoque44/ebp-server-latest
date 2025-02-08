"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCourseTimeStatus = exports.isUpComing = exports.isOngoing = exports.isEnded = exports.isCourseStarted = exports.isValidTime = void 0;
const isValidTime = (endDate) => {
    return new Date(endDate).getSeconds() < new Date().getSeconds();
};
exports.isValidTime = isValidTime;
const isCourseStarted = (startDate) => {
    return new Date(startDate).getSeconds() > new Date().getSeconds();
};
exports.isCourseStarted = isCourseStarted;
//
const isEnded = (endDate) => {
    return new Date(endDate).getTime() < new Date().getTime();
};
exports.isEnded = isEnded;
//
const isOngoing = (startDate, endDate) => {
    return (new Date(startDate).getTime() < new Date().getTime() &&
        new Date(endDate).getTime() > new Date().getTime());
};
exports.isOngoing = isOngoing;
//
const isUpComing = (startDate, endDate) => {
    return (new Date(endDate).getTime() > new Date(startDate).getTime() &&
        new Date(startDate).getTime() > new Date().getTime() &&
        new Date(endDate).getTime() > new Date().getTime());
};
exports.isUpComing = isUpComing;
//
const checkCourseTimeStatus = (startDate, endDate) => {
    return (0, exports.isEnded)(endDate)
        ? "ENDED"
        : (0, exports.isOngoing)(startDate, endDate)
            ? "ONGOING"
            : (0, exports.isUpComing)(startDate, endDate)
                ? "UPCOMING"
                : "INVALID";
};
exports.checkCourseTimeStatus = checkCourseTimeStatus;
//ENDED - ONGOING - UPCOMING
