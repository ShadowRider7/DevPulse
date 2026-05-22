import { pool } from "../../config/db";
import type { IUser } from "./users.interface";

const createUserIntoDb = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  const result = await pool.query(
    `
        INSERT INTO users(name,email,password,role) VALUES ($1,$2,$3,$4)
        RETURNING *
        `,
    [name, email, password, role],
  );
  return result;
};
const getSingleUserFromDb = async (id: string) => {
  const result = await pool.query(
    ` SELECT * FROM users WHERE id=$1
        `,
    [id],
  );
  return result;
};

export const userService = {
  createUserIntoDb,
  getSingleUserFromDb,
};
