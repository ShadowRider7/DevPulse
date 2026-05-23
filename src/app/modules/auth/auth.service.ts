import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginUserIntoDb = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;
  const userData = await pool.query(
    ` SELECT * FROM users WHERE email=$1
          `,
    [email],
  );
  if (userData.rowCount === 0) {
    throw new Error("Invalid Credentials!");
  }
  const user = userData.rows[0];

  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    throw new Error("Invalid Credentials!");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const jwtSecret = process.env.JWT_SECRET;
  const token = jwt.sign(jwtPayload, jwtSecret as string, {
    expiresIn: "1d",
  });
  delete user.password;
  return { token, user };
};
export const authService = {
  loginUserIntoDb,
};
