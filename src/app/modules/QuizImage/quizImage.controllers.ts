import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { QuizImageServices } from "./quizImage.service";

const createQuizImage = catchAsync(async (req, res) => {
  const createdQuizImage = await QuizImageServices.createQuizImageIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "QuizImage created Successfully!",
    data: createdQuizImage,
  });
});

const updateQuizImage = catchAsync(async (req, res) => {
  const updatedQuizImage = await QuizImageServices.updateQuizImageIntoDB(
    req.params.QuizImageId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "QuizImage updated Successfully!",
    data: updatedQuizImage,
  });
});

const getSingleQuizImageById = catchAsync(async (req, res) => {
  const QuizImage = await QuizImageServices.getSingleQuizImageByIdFromDb(
    req.params.QuizImageId,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "QuizImage retrive Successfully!",
    data: QuizImage,
  });
});

const getQuizImageMetaById = catchAsync(async (req, res) => {
  const QuizImage = await QuizImageServices.getQuizImageMetaById(
    req.params.QuizImageId,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "QuizImage retrive Successfully!",
    data: QuizImage,
  });
});

const getQuizImagesByQuery = catchAsync(async (req, res) => {
  const args = await QuizImageServices.getQuizImagesQueryFromDb(req.query);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "QuizImages are retrive Successfully!",
    data: args,
  });
});

const deleteQuizImage = catchAsync(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const arg = await QuizImageServices.deleteQuizImageFromDB(
    req.params.QuizImageId,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "QuizImage Deleted Successfully!",
    data: null,
  });
});
// ----------- App
const getQuizImagesQueryFromDbinApp = catchAsync(async (req, res) => {
  const args = await QuizImageServices.getQuizImagesQueryFromDbinApp(req.query);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Images are retrive Successfully!",
    data: args,
  });
});

export const QuizImageControllers = {
  createQuizImage,
  updateQuizImage,
  getSingleQuizImageById,
  getQuizImagesByQuery,
  deleteQuizImage,
  getQuizImagesQueryFromDbinApp,
  getQuizImageMetaById,
};
