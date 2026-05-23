import { Router } from "express";
import { issueController } from "./issues.controller";
import auth from "../../middleware/auth";

const router = Router();
router.post("/", issueController.createIssue);
router.get("/", auth(), issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.put("/:id", issueController.updateIssue);
router.delete("/:id", issueController.deleteIssue);

export const issueRoute = router;
