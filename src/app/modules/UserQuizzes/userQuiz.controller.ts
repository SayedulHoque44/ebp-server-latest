import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userQuizService } from "./userQuiz.service";

// create user quiz
const createUserQuiz = catchAsync(async (req, res) => {
  const createdUserQuiz = await userQuizService.createUserQuizIntoDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User Quiz created Successfully!",
    data: createdUserQuiz,
  });
});

// get user quiz by userId
const getUserQuizByQuery = catchAsync(async (req, res) => {
  const userQuiz = await userQuizService.getUserQuizByQuery(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Quiz retrive Successfully!",
    data: userQuiz,
  });
});

// get random played quizzes
const getRandomPlayedQuizzes = catchAsync(async (req, res) => {
  const randomPlayedQuizzes =
    await userQuizService.getRandomPlayedQuizzesFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Random Played Quizzes retrive Successfully!",
    data: randomPlayedQuizzes,
  });
});

export const userQuizControllers = {
  createUserQuiz,
  getUserQuizByQuery,
  getRandomPlayedQuizzes,
};
