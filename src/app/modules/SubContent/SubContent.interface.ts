import { Types } from "mongoose";

export type TSubContent = {
  RefId: Types.ObjectId;
  title: string;
  info: string;
  imageUrl: string;
  url: string;
  index: number;
};
