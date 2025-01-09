// import express from "express";
// import { Schema } from "mongoose";
// import sendResponse from "../../utils/sendResponse";
// const router = express.Router();

// router.post(
//   "/create",
//   catchAsync(async (req, res) => {
//     const exitsSystem = await SystemInfoModel.findOne({
//       category: req.body.category,
//     });
//     // if system already exits
//     if (exitsSystem) {
//       throw new AppError(httpStatus.BAD_REQUEST, "System already exits");
//     }

//     const createdSystem = await SystemInfoModel.create(req.body);

//     sendResponse(res, {
//       statusCode: 201,
//       success: true,
//       message: "System created Successfully!",
//       data: createdSystem,
//     });
//   }),
// );

// type TT = {
//     id: string;
//     createdAt: string;
//   }
// type TDT = {
//   title: string;
//   arguements: TT[];
//   arguements: TT[];
//   arguements: TT[];

// };

// const DeletedItemSchema = new Schema<TDT>({

//   title: { type: String, required: true },
//   type: { type: String, required: true },
//   Is_Control_Active: { type: Boolean, default: false },
//   controlled_By_Time: { type: Boolean, default: false },
//   start_time: { type: Date },
//   end_time: { type: Date },
//   action: { type: String, enum: controlAction, default: "idle" },
// });

// export const SystemInfoModel = model<TSystemInfo>(
//   "systemInfo",
//   systemInfoSchema,
// );
