import type { Request, Response } from "express";
import { authService } from "./auth.service";
import senResponse from "../../utils/senResponse";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDb(req.body);
    senResponse(res, {
      statusCode: 201,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    senResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
export const authController = {
  loginUser,
};
