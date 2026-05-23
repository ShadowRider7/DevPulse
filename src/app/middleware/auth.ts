import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { pool } from "../config/db";
import type { ROLES } from "../utils";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(roles);
    try {
      const token = req.headers.authorization;
      if (!token) {
        res.status(401).json({
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
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
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
