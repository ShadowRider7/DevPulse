import type { NextFunction, Request, Response } from "express";
import sendResponse from "./sendResponse";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.statusCode || 500;

  sendResponse(res, {
    statusCode: status,
    success: false,
    message: err.message || "Internal Server Error",
  });
};
export default globalErrorHandler;
