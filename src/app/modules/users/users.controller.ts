import type { Request, Response } from "express";
import { userService } from "./users.service";
import senResponse from "../../utils/senResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDb(req.body);
    senResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    senResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
export const userController = {
  createUser,
};
