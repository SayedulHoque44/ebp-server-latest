import express from "express";
import catchAsync from "../../utils/catchAsync";
import { SystemInfoModel } from "./system.model";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import validateRequest from "../../../middlewares/validateRequest";
import { systemValidations } from "./system.validation";

const router = express.Router();

router.post(
  "/create",
  validateRequest(systemValidations.createSystem),
  catchAsync(async (req, res) => {
    const exitsSystem = await SystemInfoModel.findOne({
      category: req.body.category,
    });
    // if system already exits
    if (exitsSystem) {
      throw new AppError(httpStatus.BAD_REQUEST, "System already exits");
    }

    const createdSystem = await SystemInfoModel.create(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "System created Successfully!",
      data: createdSystem,
    });
  }),
);

router.patch(
  "/:systemId/update",
  validateRequest(systemValidations.updateSystem),
  catchAsync(async (req, res) => {
    const exitsSystem = await SystemInfoModel.findById(req.params.systemId);
    // if system already exits
    if (!exitsSystem) {
      throw new AppError(httpStatus.BAD_REQUEST, "System Not Found");
    }

    const updatedSystem = await SystemInfoModel.findByIdAndUpdate(
      req.params.systemId,
      req.body,
      { new: true, runValidators: true },
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "System updated Successfully!",
      data: updatedSystem,
    });
  }),
);

router.delete(
  "/:systemId",
  catchAsync(async (req, res) => {
    const exitsSystem = await SystemInfoModel.findById(req.params.systemId);
    // if system already exits
    if (!exitsSystem) {
      throw new AppError(httpStatus.BAD_REQUEST, "System Not Found");
    }

    const updatedSystem = await SystemInfoModel.findByIdAndDelete(
      req.params.systemId,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "System Deleted Successfully!",
      data: updatedSystem,
    });
  }),
);

router.get(
  "/:systemId",
  catchAsync(async (req, res) => {
    const exitsSystem = await SystemInfoModel.findById(req.params.systemId);
    // if system already exits
    if (!exitsSystem) {
      throw new AppError(httpStatus.BAD_REQUEST, "System Not Found");
    }

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "System retrive Successfully!",
      data: exitsSystem,
    });
  }),
);
router.get(
  "/",
  catchAsync(async (req, res) => {
    const exitsSystem = await SystemInfoModel.find();
    // if system already exits

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "System retrive Successfully!",
      data: exitsSystem,
    });
  }),
);

export const systemRoutes = router;
