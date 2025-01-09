import cors from "cors";
import express, { Request, Response } from "express";
import router from "./app/routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";
const app = express();

// const port = 3000;

// parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:4173",
      "https://easybanglapatente.com",
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

app.use("/api/", router);

//
const starter = async (req: Request, res: Response) => {
  res.send("Easy Bangla Patente 🚗!");
};
app.get("/", starter);

// test route
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
app.get("/test", (req: Request, res: Response) => {
  Promise.reject();
});

// console.log(process.cwd());

// ErrorHandler
app.use(globalErrorHandler);
// // notFound or API crash
app.use(notFoundHandler);
export default app;
