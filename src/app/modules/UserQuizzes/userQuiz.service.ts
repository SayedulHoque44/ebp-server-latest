import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TopicQuizModel } from "../TopicQuizzes/topicQuizzes.model";
import { TUserQuiz } from "./userQuiz.interface";
import { UserQuizModel } from "./userQuiz.model";
import { userModel } from "../User/user.model";
import QueryBuilder from "../../../builder/QueryBuilder";

const createUserQuizIntoDB = async (payload: TUserQuiz[]) => {
  //check user exits
  const user = await userModel.findById(payload[0].userId).lean();
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
  }
  for (const madeQuiz of payload) {
    //check quiz exits
    const quiz = await TopicQuizModel.findById(madeQuiz.quizId);
    if (!quiz) {
      continue;
    }

    //check quiz already made by same user
    const alreadyMadeQuiz = await UserQuizModel.findOne({
      quizId: madeQuiz.quizId,
      userId: madeQuiz.userId,
    });
    if (alreadyMadeQuiz) {
      await UserQuizModel.findByIdAndUpdate(alreadyMadeQuiz._id, {
        givenAnswer: madeQuiz.givenAnswer,
        isCorrect: madeQuiz.isCorrect,
        playedCount: alreadyMadeQuiz.playedCount + 1,
      });
    } else {
      await UserQuizModel.create(madeQuiz);
    }
  }
  return { user, quizzesAdded: payload.length };
};

const getUserQuizByQuery = async (query: Record<string, unknown>) => {
  const userQuiz = new QueryBuilder(UserQuizModel.find(), query)
    .sort()
    .paginate()
    .fields();
  const result = await userQuiz.modelQuery.populate("quizId");
  const meta = await userQuiz.countTotal();
  return {
    meta,
    result,
  };
};

export const userQuizService = {
  createUserQuizIntoDB,
  getUserQuizByQuery,
};
