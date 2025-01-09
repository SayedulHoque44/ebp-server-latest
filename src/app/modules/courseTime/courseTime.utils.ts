export const isValidTime = (endDate: string) => {
  return new Date(endDate).getSeconds() < new Date().getSeconds();
};
export const isCourseStarted = (startDate: string) => {
  return new Date(startDate).getSeconds() > new Date().getSeconds();
};

//
export const isEnded = (endDate: string) => {
  return new Date(endDate).getTime() < new Date().getTime();
};
//
export const isOngoing = (startDate: string, endDate: string) => {
  return (
    new Date(startDate).getTime() < new Date().getTime() &&
    new Date(endDate).getTime() > new Date().getTime()
  );
};
//
export const isUpComing = (startDate: string, endDate: string) => {
  return (
    new Date(endDate).getTime() > new Date(startDate).getTime() &&
    new Date(startDate).getTime() > new Date().getTime() &&
    new Date(endDate).getTime() > new Date().getTime()
  );
};
//
export const checkCourseTimeStatus = (startDate: string, endDate: string) => {
  return isEnded(endDate)
    ? "ENDED"
    : isOngoing(startDate, endDate)
      ? "ONGOING"
      : isUpComing(startDate, endDate)
        ? "UPCOMING"
        : "INVALID";
};
//ENDED - ONGOING - UPCOMING
