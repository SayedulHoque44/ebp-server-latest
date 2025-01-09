import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

// server type
let server: Server;
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

    //server
    server = app.listen(config.port, () => {
      console.log(`Example My app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

// unhandle Rejection --> unhandaled error gula catch korar por server close korar jonno
// for Asyncrhonus:
process.on("unhandledRejection", () => {
  console.log(`😈 unhandledRejection is detected, Shutting Down the Server`);
  if (server) {
    //at first of the server then -> process close/exit
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// for Synchrouns:
process.on("uncaughtException", () => {
  console.log(`😈 uncaughtException is detected, Shutting Down the Server`);
  process.exit(1);
});
