import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ArgumentServices } from "./arguments.service";

const createArgument = catchAsync(async (req, res) => {
  const createdArgument = await ArgumentServices.createArgumentIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Argument created Successfully!",
    data: createdArgument,
  });
});

const updateArgument = catchAsync(async (req, res) => {
  const updatedArgument = await ArgumentServices.updateArgumentIntoDB(
    req.params.argId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Argument updated Successfully!",
    data: updatedArgument,
  });
});

const getSingleArgumentById = catchAsync(async (req, res) => {
  const argument = await ArgumentServices.getSingleArgumentByIdFromDb(
    req.params.argId,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Argument retrive Successfully!",
    data: argument,
  });
});

const getArgumentsByQuery = catchAsync(async (req, res) => {
  const args = await ArgumentServices.getArgumentsQueryFromDb(req.query);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Arguments are retrive Successfully!",
    data: args,
  });
});

const deleteArgument = catchAsync(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const arg = await ArgumentServices.deleteArgumentFromDB(req.params.argId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Argument Deleted Successfully!",
    data: null,
  });
});

// ----------- App
const getArgumentsByQueryInApp = catchAsync(async (req, res) => {
  const args = await ArgumentServices.getArgumentsQueryFromDbinApp(req.query);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Arguments are retrive Successfully!",
    data: args,
  });
});

export const ArgumentControllers = {
  createArgument,
  updateArgument,
  getSingleArgumentById,
  getArgumentsByQuery,
  deleteArgument,
  getArgumentsByQueryInApp,
};
