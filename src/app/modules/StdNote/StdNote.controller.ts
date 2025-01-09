import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { trucchiServices } from "./StdNote.service";
import sendResponse from "../../utils/sendResponse";

// -------- Trucchi
const createTrucchi = catchAsync(async (req: Request, res: Response) => {
  const result = await trucchiServices.createTrucchi(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Trucchi created Successfully!",
    data: result,
  });
});

const getAllTrucchiByQuery = catchAsync(async (req: Request, res: Response) => {
  const result = await trucchiServices.getAllTrucchiByQuery(req.query);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Trucchi retrive Successfully!",
    data: result,
  });
});

const deleteTrucchi = catchAsync(async (req: Request, res: Response) => {
  const result = await trucchiServices.deleteTrucchi(req.params.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Trucchi deleted Successfully!",
    data: result,
  });
});

// -------- Trucchi Images
const createTrucchiImage = catchAsync(async (req: Request, res: Response) => {
  const result = await trucchiServices.createTrucchiImage(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Trucchi Image created Successfully!",
    data: result,
  });
});

const getAllTrucchiImagesByTrucchiId = catchAsync(
  async (req: Request, res: Response) => {
    const result = await trucchiServices.getAllTrucchiImagesByTrucchiId(
      req.query,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Trucchi Images retrive Successfully!",
      data: result,
    });
  },
);

const deleteTrucchiImage = catchAsync(async (req: Request, res: Response) => {
  const result = await trucchiServices.deleteTrucchiImage(req.params.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Trucchi Image deleted Successfully!",
    data: result,
  });
});

export const trucchiControllers = {
  createTrucchi,
  getAllTrucchiByQuery,
  deleteTrucchi,
  createTrucchiImage,
  getAllTrucchiImagesByTrucchiId,
  deleteTrucchiImage,
};
