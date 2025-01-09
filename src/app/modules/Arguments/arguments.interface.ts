import { Types } from "mongoose";

export type TArgument = {
  title: string;
  image?: Types.ObjectId;
  isDeleted: boolean;
};
