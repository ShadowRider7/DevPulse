import type { Request, Response } from "express";
import { userService } from "./users.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDb(req.body);
    res.status(201).json({
      success: true,
      message: "User Created Successfully!!",
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
export const userController = {
  createUser,
};
