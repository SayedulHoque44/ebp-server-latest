import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { YTVIdeoServices } from "./YTVideo.service";

const createYTVideo = catchAsync(async (req, res) => {
  const created = await YTVIdeoServices.createYTVideo(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Video created Successfully!",
    data: created,
  });
});

const deleteVideo = catchAsync(async (req, res) => {
  const deleted = await YTVIdeoServices.deleteVideo(req.params.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Video Deleted Successfully!",
    data: deleted,
  });
});
const getAll = catchAsync(async (req, res) => {
  const deleted = await YTVIdeoServices.getAll(req.query);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Video Retrive Successfully!",
    data: deleted,
  });
});

export const YTVIdeoControllers = {
  createYTVideo,
  deleteVideo,
  getAll,
};
