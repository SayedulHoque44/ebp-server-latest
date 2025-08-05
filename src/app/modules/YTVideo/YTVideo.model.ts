import { Schema, model } from "mongoose";
import { TYTVideo } from "./YTVideo.interface";
import { VideoType } from "../User/user.constant";

const YTVideoSchema = new Schema<TYTVideo>(
  {
    title: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: VideoType,
      default: "public",
    },
  },
  {
    timestamps: true,
  },
);

// TODO: After check YTVideoModel is not used anywhere, remove it
export const YTVideoModel = model<TYTVideo>("youtubeVideo", YTVideoSchema);
