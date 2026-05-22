import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./app/config/dp";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'contributor',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues(
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(30) NOT NULL,
        status VARCHAR(30) DEFAULT 'open',
        reporter_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database initialized");
  } catch (error) {
    console.log(error);
  }
};

app.listen(PORT, async () => {
  await initDB();
  console.log(`Server running on port ${PORT}`);
});
