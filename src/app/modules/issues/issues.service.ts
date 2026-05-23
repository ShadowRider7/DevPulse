import { pool } from "../../config/db";
import type { IIssue } from "./issue.interface";

const issueIntoDb = async (payload: IIssue, id: number) => {
  const { title, description, type } = payload;
  const result = await pool.query(
    `
        INSERT INTO issues(title,description,type,reporter_id) VALUES ($1,$2,$3,$4)
        RETURNING *
        `,
    [title, description, type, id],
  );
  return result;
};

const getIssueFromDb = async (query: any) => {
  const { sort = "newest", type, status } = query;

  let sql = `
    SELECT *
    FROM issues
  `;

  const conditions: string[] = [];
  const values: any[] = [];

  if (type) {
    values.push(type);

    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);

    conditions.push(`status = $${values.length}`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  if (sort === "oldest") {
    sql += ` ORDER BY created_at ASC`;
  } else {
    sql += ` ORDER BY created_at DESC`;
  }

  const issuesResult = await pool.query(sql, values);

  const issues = issuesResult.rows;

  if (issues.length === 0) {
    return [];
  }

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  const usersResult = await pool.query(
    `
    SELECT id,name,role
    FROM users
    WHERE id = ANY($1)
    `,
    [reporterIds],
  );

  const usersMap = usersResult.rows.reduce(
    (acc, user) => {
      acc[user.id] = user;

      return acc;
    },
    {} as Record<number, any>,
  );

  const formattedIssues = issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: usersMap[issue.reporter_id],
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));

  return formattedIssues;
};
const getSingleIssueFromDb = async (id: string) => {
  const issueResult = await pool.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [id],
  );

  if (issueResult.rowCount === 0) {
    throw new Error("Issue not found!");
  }

  const issue = issueResult.rows[0];

  const reporterResult = await pool.query(
    `
    SELECT id,name,role
    FROM users
    WHERE id = $1
    `,
    [issue.reporter_id],
  );

  const reporter = reporterResult.rows[0];

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};
const updateIssueFromDb = async (
  payload: Partial<IIssue>,
  issueId: string,
  user: {
    id: number;
    role: string;
  },
) => {
  const issueResult = await pool.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [issueId],
  );

  if (issueResult.rowCount === 0) {
    throw new Error("Issue not found!");
  }

  const issue = issueResult.rows[0];

  if (user.role !== "maintainer" && issue.reporter_id !== user.id) {
    throw new Error("You can only update your own issues");
  }

  if (user.role !== "maintainer" && issue.status !== "open") {
    throw new Error("You cannot update non-open issues");
  }

  const { title, description, type } = payload;

  const result = await pool.query(
    `
    UPDATE issues
    SET
      title = COALESCE($1,title),
      description = COALESCE($2,description),
      type = COALESCE($3,type),
      status = 'in_progress',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *
    `,
    [title ?? null, description ?? null, type ?? null, issueId],
  );

  return result.rows[0];
};
const deleteIssueFromDb = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  if (result.rowCount === 0) {
    throw new Error("Issue not found!");
  }

  return result;
};
export const issueService = {
  issueIntoDb,
  getIssueFromDb,
  getSingleIssueFromDb,
  updateIssueFromDb,
  deleteIssueFromDb,
};
