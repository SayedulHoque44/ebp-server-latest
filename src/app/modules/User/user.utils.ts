import { TDeviceLogin } from "./user.interface";

//
export const checkSameDeviceFound = (
  loggedDevices: TDeviceLogin[],
  currentDevice: string,
) => {
  let matched = false;
  for (const device of loggedDevices) {
    if (device.deviceInfo === currentDevice) {
      matched = true;
    }
  }

  return matched;
};
