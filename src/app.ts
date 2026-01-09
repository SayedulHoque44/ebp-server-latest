import cors from "cors";
import express, { Request, Response } from "express";
import router from "./app/routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";
import { RateLimitModel } from "./app/modules/RateLimiter/RateLimit.model";
import { ConfigLimiter } from "./middlewares/RateLimiter/CreateRateLimiter";

const app = express();

// const port = 3000;

// parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:4173",
      "https://easybanglapatente.com",
      "https://easy-bangla-patente.web.app",
    ],
  }),
);
// app.use(
//   cors({
//     origin: "*",
//   }),
// );

// Monitoring Middleware
// app.use(SaveLogsDataOfuser);

// Apply global rate limiter to all routes
app.use(ConfigLimiter.global);

app.use("/api/", router);

// Monitoring endpoint
app.get("/api/status", async (req, res) => {
  try {
    const memoryUsage = process.memoryUsage();
    const rateLimitRecords = await RateLimitModel.estimatedDocumentCount();
    res.json({
      rateLimitRecords,
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      memoryUsage: memoryUsage,
    });
  } catch (err) {
    res.status(500).json({ error: "Monitoring unavailable" });
  }
});

//
const starter = async (req: Request, res: Response) => {
  res.send("Easy Bangla Patente 🚗!");
};
app.get("/", starter);

// test route
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
app.get("/test", async (req: Request, res: Response) => {
  try {
    await Promise.reject();
  } catch (error) {
    res.send("Erro Occurs test mai n i am changes");
  }
});

// Start the cron job
// deleteOldUserLogs(); // This initializes the cron job
// console.log(process.cwd());

// ErrorHandler
app.use(globalErrorHandler);
// // notFound or API crash
app.use(notFoundHandler);
export default app;

// git feature/user_logs
