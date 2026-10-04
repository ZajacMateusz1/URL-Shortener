import app from "./app.js";
import { connectRedis } from "@/config/redis.js";

const startServer = async () => {
  try {
    await connectRedis();
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
