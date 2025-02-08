"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSameDeviceFound = void 0;
//
const checkSameDeviceFound = (loggedDevices, currentDevice) => {
    let matched = false;
    for (const device of loggedDevices) {
        if (device.deviceInfo === currentDevice) {
            matched = true;
        }
    }
    return matched;
};
exports.checkSameDeviceFound = checkSameDeviceFound;
