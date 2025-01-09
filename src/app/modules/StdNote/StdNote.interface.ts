import { Types } from "mongoose";

export type TStdNote = {
  group: string;
  name: string;
};

export type TStdNoteImage = {
  StdNoteId: Types.ObjectId;
  imageUrl: string;
  index: number;
};
