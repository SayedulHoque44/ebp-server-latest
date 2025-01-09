import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";

import sendResponse from "../../utils/sendResponse";
import { UniContentServices } from "./UniContent.service";

// -------- UniContent
const createUniContent = catchAsync(async (req: Request, res: Response) => {
  const result = await UniContentServices.createUniContent(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "UniContent created Successfully!",
    data: result,
  });
});

const getAllUniContentByQuery = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UniContentServices.getAllUniContentByQuery(req.query);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "UniContent retrive Successfully!",
      data: result,
    });
  },
);

const deleteUniContent = catchAsync(async (req: Request, res: Response) => {
  const result = await UniContentServices.deleteUniContent(req.params.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "UniContent deleted Successfully!",
    data: result,
  });
});

const updateContent = catchAsync(async (req, res) => {
  const updated = await UniContentServices.updateUniContentIntoDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Content updated Successfully!",
    data: updated,
  });
});

export const UniContentControllers = {
  createUniContent,
  getAllUniContentByQuery,
  deleteUniContent,
  updateContent,
};
