import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { SubContentServices } from "./SubContent.service";
import sendResponse from "../../utils/sendResponse";

// -------- SubConten
const createSubContent = catchAsync(async (req: Request, res: Response) => {
  const result = await SubContentServices.createSubContent(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "SubContent created Successfully!",
    data: result,
  });
});

const getAllSubContentByQuery = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubContentServices.getAllSubContentByQuery(req.query);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "SubContent retrive Successfully!",
      data: result,
    });
  },
);

const deleteSubContent = catchAsync(async (req: Request, res: Response) => {
  const result = await SubContentServices.deleteSubContent(req.params.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "SubContent deleted Successfully!",
    data: result,
  });
});

const updateSubContent = catchAsync(async (req, res) => {
  const updated = await SubContentServices.updateSubContentIntoDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "SubContent updated Successfully!",
    data: updated,
  });
});

export const SubContentControllers = {
  createSubContent,
  getAllSubContentByQuery,
  deleteSubContent,
  updateSubContent,
};
