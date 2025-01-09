import httpStatus from "http-status";
import QueryBuilder from "../../../builder/QueryBuilder";
import AppError from "../../error/AppError";

import { TrucchiImageModel, TrucchiModel } from "./StdNote.model";
import { TStdNote, TStdNoteImage } from "./StdNote.interface";

//------------- trucchi
// create Trucchi
const createTrucchi = async (payload: TStdNote) => {
  const create = await TrucchiModel.create(payload);
  return create;
};
// get Trucchi
const getAllTrucchiByQuery = async (query: Record<string, unknown>) => {
  const TrucchiQuery = new QueryBuilder(TrucchiModel.find(), query)
    .search(["title ", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await TrucchiQuery.modelQuery;

  const meta = await TrucchiQuery.countTotal();
  return {
    meta,
    result,
  };
};
// create Trucchi
const deleteTrucchi = async (id: string) => {
  const del = await TrucchiModel.findByIdAndDelete(id);
  // delete images also
  await TrucchiImageModel.deleteMany({
    trucchiId: id,
  });
  return del;
};
//-------------trucchi image
// create Trucchi image
const createTrucchiImage = async (payload: TStdNoteImage) => {
  const trucchi = await TrucchiModel.findById(payload.StdNoteId);
  if (!trucchi) {
    throw new AppError(httpStatus.BAD_REQUEST, "Trucchi Not Found!");
  }

  const trucchiImages = await TrucchiImageModel.countDocuments();
  payload.index = trucchiImages + 1;
  const create = await TrucchiImageModel.create(payload);
  return create;
};

const getAllTrucchiImagesByTrucchiId = async (
  query: Record<string, unknown>,
) => {
  const TrucchiImagesQuery = new QueryBuilder(TrucchiImageModel.find(), query)
    .search(["title ", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await TrucchiImagesQuery.modelQuery; //.populate("trucchiId");

  const meta = await TrucchiImagesQuery.countTotal();
  return {
    meta,
    result,
  };
};
// create Trucchi
const deleteTrucchiImage = async (id: string) => {
  const del = await TrucchiImageModel.findByIdAndDelete(id);

  return del;
};

export const trucchiServices = {
  createTrucchi,
  getAllTrucchiByQuery,
  deleteTrucchi,
  createTrucchiImage,
  getAllTrucchiImagesByTrucchiId,
  deleteTrucchiImage,
};
