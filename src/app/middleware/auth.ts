import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { pool } from "../config/db";
import type { ROLES } from "../utils";
import sendResponse from "../utils/sendResponse";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized access!",
        });
      }

      const secret = process.env.JWT_SECRET;
      const decoded = jwt.verify(
        token as string,
        secret as string,
      ) as JwtPayload;
      const userData = await pool.query(
        `
      SELECT * FROM users WHERE email=$1
      
      `,
        [decoded.email],
      );

      const user = userData.rows[0];
      if (userData.rowCount === 0) {
        sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "User not found",
        });
      }
      if (roles.length && !roles.includes(user.role)) {
        sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden!",
        });
      }
      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
};
export default auth;
