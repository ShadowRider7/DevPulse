import type { Request, Response } from "express";
import { issueService } from "./issues.service";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.issueIntoDb(req.body);
    res.status(201).json({
      success: true,
      message: "Issue Created Successfully!!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};
const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getIssueFromDb();
    res.status(201).json({
      success: true,
      message: "Issues Retrieved Successfully!!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
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
    res.status(201).json({
      success: true,
      message: "Issue Retrieved Successfully!!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};
const updateIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await issueService.updateIssueFromDb(req.body, id as string);
    res.status(201).json({
      success: true,
      message: "Issue updated Successfully!!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
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
    res.status(201).json({
      success: true,
      message: "Issue deleted Successfully!!",
    });
  } catch (error: any) {
    res.status(500).json({
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
