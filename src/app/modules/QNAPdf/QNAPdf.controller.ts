import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { QNAPdfServices } from "./QNAPdf.service";

const createQNAPdf = catchAsync(async (req, res) => {
  const createdPDF = await QNAPdfServices.createQNAPdfIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "PDF created Successfully!",
    data: createdPDF,
  });
});

const getAllQNAPdf = catchAsync(async (req, res) => {
  const pdfs = await QNAPdfServices.getAllQNAPdfIntoDB();

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "PDF retrive Successfully!",
    data: pdfs,
  });
});

const deleteQNAPdf = catchAsync(async (req, res) => {
  const createdPDF = await QNAPdfServices.deleteQNAPdfIntoDB(req.params.pdfId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "PDF deleted Successfully!",
    data: createdPDF,
  });
});

//
export const QNAPdfControllers = {
  createQNAPdf,
  getAllQNAPdf,
  deleteQNAPdf,
};
