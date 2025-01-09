import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ArgTopicServices } from "./argTopics.service";

const createArgTopic = catchAsync(async (req, res) => {
  const createdArgTopic = await ArgTopicServices.createArgTopicIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Argument Topic created Successfully!",
    data: createdArgTopic,
  });
});

const updateArgTopic = catchAsync(async (req, res) => {
  const updatedArgTopic = await ArgTopicServices.updateArgTopicIntoDB(
    req.params.argTopicId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Argument Topic updated Successfully!",
    data: updatedArgTopic,
  });
});

const getSingleArgTopicById = catchAsync(async (req, res) => {
  const argTopic = await ArgTopicServices.getSingleArgTopicByIdFromDb(
    req.params.argTopicId,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Argument Topic retrive Successfully!",
    data: argTopic,
  });
});

const getArgTopicsByQuery = catchAsync(async (req, res) => {
  const args = await ArgTopicServices.getArgTopicsQueryFromDb(req.query);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Argument Topics are retrive Successfully!",
    data: args,
  });
});

const deleteArgTopic = catchAsync(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const argTopic = await ArgTopicServices.deleteArgTopicFromDB(
    req.params.argTopicId,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Argument Topic Deleted Successfully!",
    data: null,
  });
});
//
const addTheroyImagesInArgTopic = catchAsync(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const argTopic = await ArgTopicServices.addTheroyImagesInArgTopic(
    req.params.argTopicId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Theory Images Added Successfully!",
    data: argTopic,
  });
});
const deleteTheroyImagesFromArgTopic = catchAsync(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const argTopic = await ArgTopicServices.deleteTheroyImagesFromArgTopic(
    req.params.argTopicId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Theory Images deleted Successfully!",
    data: argTopic,
  });
});

// ----------- App
const getArgTopicsQueryFromDbinApp = catchAsync(async (req, res) => {
  const args = await ArgTopicServices.getArgTopicsQueryFromDbinApp(req.query);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Topics are retrive Successfully!",
    data: args,
  });
});

export const ArgTopicControllers = {
  createArgTopic,
  updateArgTopic,
  getSingleArgTopicById,
  getArgTopicsByQuery,
  deleteArgTopic,
  addTheroyImagesInArgTopic,
  deleteTheroyImagesFromArgTopic,
  getArgTopicsQueryFromDbinApp,
};
