import { Schema, model } from "mongoose";
import { courseTimeStatus } from "./courseTime.constant";
import { TCoursesTime } from "./courseTime.interface";

const coursesTimeSchema = new Schema<TCoursesTime>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    durationInMonths: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: courseTimeStatus,
    },
  },
  { timestamps: true },
);

//
export const courseTimesModel = model<TCoursesTime>(
  "courseTime",
  coursesTimeSchema,
);
