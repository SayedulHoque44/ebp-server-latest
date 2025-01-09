import httpStatus from "http-status";
import QueryBuilder from "../../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { UniContentModel } from "../UniContent/UniContent.model";
import { TSubContent } from "./SubContent.interface";
import { SubContentModel } from "./SubContent.model";
import {
  EBP_Images_CDN_BaseUrl,
  getObjectKeyFromUrl,
} from "../../utils/globalUtilsFn";
import { deleteS3Object } from "../../utils/s3";

//------------- SubContent
// create SubContent
const createSubContent = async (payload: TSubContent) => {
  try {
    const UniContent = await UniContentModel.findById(payload.RefId);
    if (!UniContent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Content Not Found!");
    }

    const indexed = await SubContentModel.countDocuments({
      RefId: payload.RefId,
    });
    payload.index = indexed + 1;
    const create = await SubContentModel.create(payload);
    return create;
  } catch (error) {
    const imageUrl = payload.imageUrl;
    const url = payload.url;
    if (imageUrl) {
      const objectKey = getObjectKeyFromUrl(EBP_Images_CDN_BaseUrl, imageUrl);
      await deleteS3Object(objectKey);
    }
    if (url) {
      const objectKey = getObjectKeyFromUrl(EBP_Images_CDN_BaseUrl, url);
      await deleteS3Object(objectKey);
    }
    throw new AppError(httpStatus.BAD_REQUEST, "Faild to create Sub content!");
  }
};
// get SubContent
const getAllSubContentByQuery = async (query: Record<string, unknown>) => {
  const SubContentQuery = new QueryBuilder(SubContentModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await SubContentQuery.modelQuery.populate(["RefId"]);

  const meta = await SubContentQuery.countTotal();
  return {
    meta,
    result,
  };
};
// create SubContent
const deleteSubContent = async (id: string) => {
  const subContent = await SubContentModel.findById(id);
  if (!subContent) {
    throw new AppError(httpStatus.BAD_REQUEST, "Sub Content Not found!");
  }
  //
  const del = await SubContentModel.findByIdAndDelete(id);
  //
  const imageUrl = subContent.imageUrl;
  const url = subContent.url;
  //
  if (imageUrl) {
    const objectKey = getObjectKeyFromUrl(EBP_Images_CDN_BaseUrl, imageUrl);
    await deleteS3Object(objectKey);
  }
  //
  if (url) {
    const objectKey = getObjectKeyFromUrl(EBP_Images_CDN_BaseUrl, url);
    await deleteS3Object(objectKey);
  }
  return del;
};

const updateSubContentIntoDB = async (
  ContentId: string,
  payload: Partial<TSubContent>,
) => {
  try {
    const subContent = await SubContentModel.findById(ContentId);

    if (!subContent) {
      throw new AppError(httpStatus.NOT_FOUND, "Content Not Found!");
    }

    const updatedContent = await SubContentModel.findByIdAndUpdate(
      ContentId,
      payload,
      {
        new: true,
      },
    );

    // If already there imageUrl exits !! then delet previous one if want to set new one
    if (payload.imageUrl) {
      const previousSubContentImgurl = subContent.imageUrl;
      if (previousSubContentImgurl) {
        const objectKey = getObjectKeyFromUrl(
          EBP_Images_CDN_BaseUrl,
          previousSubContentImgurl,
        );
        await deleteS3Object(objectKey);
      }
    }
    if (payload.url) {
      const previousSubCotentUrl = subContent.url;
      if (previousSubCotentUrl) {
        const objectKey = getObjectKeyFromUrl(
          EBP_Images_CDN_BaseUrl,
          previousSubCotentUrl,
        );
        await deleteS3Object(objectKey);
      }
    }

    return updatedContent;
  } catch (error) {
    if (payload.imageUrl) {
      const objectKey = getObjectKeyFromUrl(
        EBP_Images_CDN_BaseUrl,
        payload.imageUrl,
      );
      await deleteS3Object(objectKey);
    }
    if (payload.url) {
      const objectKey = getObjectKeyFromUrl(
        EBP_Images_CDN_BaseUrl,
        payload.url,
      );
      await deleteS3Object(objectKey);
    }
  }
  throw new AppError(
    httpStatus.FAILED_DEPENDENCY,
    "Faild to update Sub Content!",
  );
};

export const SubContentServices = {
  createSubContent,
  getAllSubContentByQuery,
  deleteSubContent,
  updateSubContentIntoDB,
};
