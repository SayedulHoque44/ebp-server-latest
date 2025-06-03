import { model, Schema } from "mongoose";
import {
  controlAction,
  SystemCategory,
  TControls,
  TPoster,
  TSocialMedia,
  TSystemInfo,
} from "./system.interface";

const social_mediaSchema = new Schema<TSocialMedia>({
  name: { type: String, required: true },
  url: { type: String, required: true },
});
const postersSchema = new Schema<TPoster>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  status: { type: String, required: true },
});
const adsSchema = new Schema<TPoster>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  status: { type: String, required: true },
});

const systemInfoSchema = new Schema<TSystemInfo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    unique: true,
    enum: SystemCategory,
  },
  logo_name: { type: String },
  logo_url: { type: String },
  primary_color: { type: String },
  secondary_color: { type: String },
  social_media: { type: [social_mediaSchema] },
  redirect_url: { type: [social_mediaSchema] },
  posters: { type: [postersSchema] },
  ads: { type: [adsSchema] },
});

const controlsSchema = new Schema<TControls>({
  systemId: { type: Schema.Types.ObjectId, required: true, ref: "systemInfo" },
  title: { type: String, required: true },
  type: { type: String, required: true },
  Is_Control_Active: { type: Boolean, default: false },
  controlled_By_Time: { type: Boolean, default: false },
  start_time: { type: Date },
  end_time: { type: Date },
  action: { type: String, enum: controlAction, default: "idle" },
});

export const SystemInfoModel = model<TSystemInfo>(
  "systemInfo",
  systemInfoSchema,
);
export const ControlModel = model<TControls>("control", controlsSchema);

// Flow -
// 1. Create a new system
// 2. Create a new control for the system
// 3. Update the control

//  -in a system
// - firstly system get will be called using sytem id from the individual system
// - also using system id controls get will be called for using
// - then the system id also send to the every api call from the system
