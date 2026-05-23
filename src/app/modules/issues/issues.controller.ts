import type { Request, Response } from "express";
import { issueService } from "./issues.service";
import sendResponse from "../../utils/sendResponse";

const createIssue = async (req: Request, res: Response) => {
  const id = req.user?.id;
  try {
    const result = await issueService.issueIntoDb(req.body, id);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue Created Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      data: error,
    });
  }
};
const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getIssueFromDb(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      data: error,
    });
  }
};
const getSingleIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await issueService.getSingleIssueFromDb(id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      data: error,
    });
  }
};
const updateIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Issue id is required",
    });
  }

  const user = req.user as {
    id: number;
    role: string;
  };

  try {
    const result = await issueService.updateIssueFromDb(
      req.body,
      id as string,
      user,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      data: error,
    });
  }
};
const deleteIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await issueService.deleteIssueFromDb(id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      data: error,
    });
  }
};
export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
