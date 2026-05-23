import type { Request, Response } from "express";
import { userService } from "./users.service";
import sendResponse from "../../utils/sendResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDb(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
export const userController = {
  createUser,
};
