import { Types } from "mongoose";

export type TArgTopic = {
  argumentId: Types.ObjectId;
  title: string;
  theory: string;
  videoUrl?: string;
  image?: Types.ObjectId;
  theoryImages?: string[];
  isDeleted: boolean;
};

// export type TImages = {
//   imageId: Types.ObjectId;
//   figure: string;
//   imageUrl: string;
//   pinned: boolean;
//   isDeleted: boolean;
// };
