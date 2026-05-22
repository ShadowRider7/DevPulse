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
const updateIssueFromDb = async (payload: IIssue, id: string) => {
  const { title, description } = payload;
  const result = await pool.query(
    ` UPDATE issues 
    SET 
    title=COALESCE($1,title),
    description=COALESCE($2,description),
    status='in_progress',
     updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
    RETURNING *
        `,
    [title, description, id],
  );
  return result;
};
const deleteIssueFromDb = async (id: string) => {
  const result = await pool.query(
    ` DELETE FROM issues WHERE id = $1
        `,
    [id],
  );
  return result;
};
export const issueService = {
  issueIntoDb,
  getIssueFromDb,
  getSingleIssueFromDb,
  updateIssueFromDb,
  deleteIssueFromDb,
};
