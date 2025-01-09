import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import config from "../app/config";
import AppError from "../app/error/AppError";
import { handleDupliacteError } from "../app/error/handleDuplicateError";
import handleValidationError from "../app/error/handleValidationError";
import handleZodError from "../app/error/handleZodError";
import { TErrorSources } from "../app/interface/error";

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  //setting default values
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: TErrorSources = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];
  // handle multiple type error
  if (err instanceof ZodError) {
    //Zod Error

    const simplifiedError = handleZodError(err);
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
    statusCode = 400;
  } else if (err?.name === "ValidationError") {
    //Validation Error
    const simplifiedError = handleValidationError(err);
    statusCode = 400;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    //App Error
    message = err.message;
    statusCode = err.statusCode;
    errorSources = [
      {
        path: "Custom Error",
        message: err.message,
      },
    ];
  } else if (err?.code === 11000) {
    //check duplicate user
    message = handleDupliacteError(err);
  }

  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: config.node_env === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
