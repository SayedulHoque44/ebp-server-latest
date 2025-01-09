import { Types } from "mongoose";

export type TCoursesTime = {
  userId: Types.ObjectId;
  startDate: string;
  endDate: string;
  durationInMonths: number;
  status: "ENDED" | "ONGOING" | "UPCOMING" | "INVALID";
};
