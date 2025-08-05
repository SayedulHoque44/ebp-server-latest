import express from "express";
import catchAsync from "../../utils/catchAsync";
import { SystemInfoModel } from "./system.model";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import validateRequest from "../../../middlewares/validateRequest";
import { systemValidations } from "./system.validation";
import { RateLimitModel } from "../RateLimiter/RateLimit.model";
import { ArgTopicsModel } from "../ArgTopics/argTopics.model";
import { ArgumentsModel } from "../Arguments/arguments.model";
import { BlogModel } from "../Blogs/Blogs.model";
import { courseTimesModel } from "../courseTime/courseTime.model";
import { QNAPdfModel } from "../QNAPdf/QNAPdf.model";
import { QuizImageModel } from "../QuizImage/quizImage.model";

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

// HeapStatus routes
router.get(
  "/status",
  catchAsync(async (req, res) => {
    try {
      const memoryUsage = process.memoryUsage();
      const rateLimitRecords = await RateLimitModel.estimatedDocumentCount();

      const Arguments = await ArgumentsModel.estimatedDocumentCount();
      const Theory = await ArgTopicsModel.estimatedDocumentCount();
      const QuizImages = await QuizImageModel.estimatedDocumentCount();

      const Blogs = await BlogModel.estimatedDocumentCount();

      const courseTimes = await courseTimesModel.estimatedDocumentCount();
      const QNAPdfs = await QNAPdfModel.estimatedDocumentCount();

      const QuizInfo = {
        Arguments,
        Theory,
        QuizImages,
      };

      const DocumentCount = {
        rateLimitRecords,
        Blogs,
        courseTimes,
        QNAPdfs,
        QuizInfo,
      };
      const Memory = {
        rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        memoryUsage: memoryUsage,
      };
      res.json({
        DocumentCount,
        Memory,
      });
    } catch (err) {
      res.status(500).json({ error: "Monitoring unavailable" });
    }
  }),
);

export const systemRoutes = router;
