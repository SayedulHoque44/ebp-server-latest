import { Types } from "mongoose";

export type TTopicQuiz = {
  argumentId: Types.ObjectId;
  ArgTopicId: Types.ObjectId;
  question: string;
  answer: "V" | "F";
  image?: Types.ObjectId;
  authorAudio?: string;
  isDeleted: boolean;
};
