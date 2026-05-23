import { pool } from "../../config/db";
import type { IUser } from "./users.interface";
import bcrypt from "bcrypt";

const SALT_ROUNDS: number = Number(process.env.BCRYPT_SALT_ROUNDS);

const createUserIntoDb = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  const finalRole = role || "contributor";

  const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await pool.query(
    `
        INSERT INTO users(name,email,password,role) VALUES ($1,$2,$3,$4)
        RETURNING *
        `,
    [name, email, hashPassword, finalRole],
  );
  delete result.rows[0].password;
  return result;
};
const getSingleUserFromDb = async (payload: IUser) => {
  const { email, password } = payload;
  const result = await pool.query(
    ` SELECT * FROM users WHERE email=$1 AND password=$2
        `,
    [email, password],
  );
  return result;
};

export const userService = {
  createUserIntoDb,
  getSingleUserFromDb,
};
