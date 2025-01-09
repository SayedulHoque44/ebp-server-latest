import QueryBuilder from "../../../builder/QueryBuilder";
import { TYTVideo } from "./YTVideo.interface";
import { YTVideoModel } from "./YTVideo.model";

const createYTVideo = async (payload: TYTVideo) => {
  const create = await YTVideoModel.create(payload);
  return create;
};
const deleteVideo = async (id: string) => {
  const deleted = await YTVideoModel.findByIdAndDelete(id);
  return deleted;
};
const getAll = async (query: Record<string, any>) => {
  const Videos = new QueryBuilder(YTVideoModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await Videos.modelQuery;

  const meta = await Videos.countTotal();
  return {
    meta,
    result,
  };
};
export const YTVIdeoServices = {
  createYTVideo,
  deleteVideo,
  getAll,
};
