import app from "./app/app";
import { initDB } from "./app/config";
const PORT = process.env.PORT;
const main = () => {
  app.listen(PORT, async () => {
    await initDB();
    console.log(`Server running on port ${PORT}`);
  });
};
main();
