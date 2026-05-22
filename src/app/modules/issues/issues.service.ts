import { pool } from "../../config/db";
import type { IIssue } from "./issue.interface";

const issueIntoDb = async (payload: IIssue) => {
  const { title, description, type, reporter_id } = payload;
  const result = await pool.query(
    `
        INSERT INTO issues(title,description,type,reporter_id) VALUES ($1,$2,$3,$4)
        RETURNING *
        `,
    [title, description, type, reporter_id],
  );
  return result;
};

const getIssueFromDb = async () => {
  const result = await pool.query(
    ` SELECT * FROM issues
        `,
  );
  return result;
};
const getSingleIssueFromDb = async (id: string) => {
  const result = await pool.query(
    ` SELECT * FROM issues WHERE id = $1
        `,
    [id],
  );
  return result;
};
export const issueService = {
  issueIntoDb,
  getIssueFromDb,
  getSingleIssueFromDb,
};
