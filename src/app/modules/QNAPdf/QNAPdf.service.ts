import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TQNAPdf } from "./QNAPdf.interface";
import { QNAPdfModel } from "./QNAPdf.model";

const createQNAPdfIntoDB = async (payload: TQNAPdf) => {
  const create = await QNAPdfModel.create(payload);

  return create;
};

const getAllQNAPdfIntoDB = async () => {
  const create = await QNAPdfModel.find().sort("-createdAt");

  return create;
};

const deleteQNAPdfIntoDB = async (pdfId: string) => {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const deletePDF = await QNAPdfModel.findByIdAndDelete(pdfId);

  if (!deletePDF) {
    throw new AppError(httpStatus.BAD_REQUEST, "PDF not found!");
  }

  return null;
};

//
export const QNAPdfServices = {
  createQNAPdfIntoDB,
  deleteQNAPdfIntoDB,
  getAllQNAPdfIntoDB,
};
