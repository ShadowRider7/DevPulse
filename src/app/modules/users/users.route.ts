import { Router, type Request, type Response } from "express";
import { pool } from "../../config/db";

const router = Router();
router.post("/", async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const result = await pool.query(
      `
        INSERT INTO users(name,email,password,role) VALUES ($1,$2,$3,$4)
        `,
      [name, email, password, role],
    );
    res.status(201).json({
      success: true,
      message: "User Created Successfully!!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

export const userRoute = router;
