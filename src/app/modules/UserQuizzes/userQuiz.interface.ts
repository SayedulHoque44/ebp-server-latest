import { Types } from "mongoose";

export interface TUserQuiz {
  quizId: Types.ObjectId;
  userId: Types.ObjectId;
  givenAnswer: "V" | "F";
  isCorrect: boolean;
  playedCount: number;
}
