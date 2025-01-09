import httpStatus from "http-status";
import QueryBuilder from "../../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { SubContentModel } from "../SubContent/SubContent.model";
import { TUniContent } from "./UniContent.interface";

import { UniContentModel } from "./UniContent.model";
import {
  EBP_Images_CDN_BaseUrl,
  getObjectKeyFromUrl,
} from "../../utils/globalUtilsFn";
import { deleteS3Object } from "../../utils/s3";

// create UniContent
const createUniContent = async (payload: TUniContent) => {
  try {
    const create = await UniContentModel.create(payload);
    return create;
  } catch (error) {
    const imageUrl = payload.imageUrl;
    if (imageUrl) {
      const objectKey = getObjectKeyFromUrl(EBP_Images_CDN_BaseUrl, imageUrl);
      await deleteS3Object(objectKey);
    }
    throw new AppError(httpStatus.BAD_REQUEST, "Faild to create uni content!");
  }
};
// get UniContent
const getAllUniContentByQuery = async (query: Record<string, unknown>) => {
  const UniContentQuery = new QueryBuilder(UniContentModel.find(), query)
    .search(["title ", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await UniContentQuery.modelQuery;

  const meta = await UniContentQuery.countTotal();
  return {
    meta,
    result,
  };
};
// create UniContent
const deleteUniContent = async (id: string) => {
  const subContentExits = await SubContentModel.countDocuments({
    RefId: id,
  });

  if (subContentExits > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please Delete Sub Content first then try again!",
    );
  }
  const uniContent = await UniContentModel.findById(id);
  if (!uniContent) {
    throw new AppError(httpStatus.BAD_REQUEST, "Content Not Found!");
  }
  const del = await UniContentModel.findByIdAndDelete(id);
  if (!del) {
    throw new AppError(httpStatus.BAD_REQUEST, "Faild to delete uniContent");
  }
  // Delete Page
  await SubContentModel.countDocuments({
    RefId: id,
  });

  // Delete img
  const imageUrl = uniContent.imageUrl;
  if (imageUrl) {
    const objectKey = getObjectKeyFromUrl(EBP_Images_CDN_BaseUrl, imageUrl);
    await deleteS3Object(objectKey);
  }
  return del;
};

const updateUniContentIntoDB = async (
  ContentId: string,
  payload: Partial<TUniContent>,
) => {
  const uniContent = await UniContentModel.findById(ContentId);

  if (!uniContent) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog Not Found!");
  }

  const updatedContent = await UniContentModel.findByIdAndUpdate(
    ContentId,
    payload,
    {
      new: true,
    },
  );
  return updatedContent;
};

export const UniContentServices = {
  createUniContent,
  getAllUniContentByQuery,
  deleteUniContent,
  updateUniContentIntoDB,
};
