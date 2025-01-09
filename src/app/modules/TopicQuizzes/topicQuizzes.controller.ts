import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TopicQuizServices } from "./topicQuizzes.service";

const createTopicQuiz = catchAsync(async (req, res) => {
  const createdTopicQuiz = await TopicQuizServices.createTopicQuizIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Quiz created Successfully!",
    data: createdTopicQuiz,
  });
});

const updateTopicQuiz = catchAsync(async (req, res) => {
  const updatedTopicQuiz = await TopicQuizServices.updateTopicQuizIntoDB(
    req.params.topicQuizId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Quiz updated Successfully!",
    data: updatedTopicQuiz,
  });
});

const getSingleTopicQuizById = catchAsync(async (req, res) => {
  const TopicQuiz = await TopicQuizServices.getSingleTopicQuizByIdFromDb(
    req.params.topicQuizId,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Quiz retrive Successfully!",
    data: TopicQuiz,
  });
});

const getTopicQuizzesByQuery = catchAsync(async (req, res) => {
  const TopicQuizzes = await TopicQuizServices.getTopicQuizzesQueryFromDb(
    req.query,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Quizzes are retrive Successfully!",
    data: TopicQuizzes,
  });
});

const deleteTopicQuiz = catchAsync(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const deletedTopicQuiz = await TopicQuizServices.deleteTopicQuizFromDB(
    req.params.topicQuizId,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Quiz Deleted Successfully!",
    data: null,
  });
});

// ----------- App
const getQuizzesQueryFromDbinApp = catchAsync(async (req, res) => {
  const args = await TopicQuizServices.getQuizzesQueryFromDbinApp(req.query);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Quiz are retrive Successfully!",
    data: args,
  });
});

export const TopicQuizControllers = {
  createTopicQuiz,
  updateTopicQuiz,
  getSingleTopicQuizById,
  getTopicQuizzesByQuery,
  deleteTopicQuiz,
  getQuizzesQueryFromDbinApp,
};
