import { Router } from "express";
import { issueController } from "./issues.controller";

const router = Router();
router.post("/", issueController.createIssue);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);

export const issueRoute = router;
