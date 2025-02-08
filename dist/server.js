"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
// server type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
            //server
            server = app_1.default.listen(config_1.default.port, () => {
                console.log(`Example My app listening on port ${config_1.default.port}`);
            });
        }
        catch (err) {
            console.log(err);
        }
    });
}
main();
// unhandle Rejection --> unhandaled error gula catch korar por server close korar jonno
// for Asyncrhonus:
// process.on("unhandledRejection", () => {
//   console.log(`😈 unhandledRejection is detected, Shutting Down the Server`);
//   if (server) {
//     //at first of the server then -> process close/exit
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1);
// });
// for Synchrouns:
// process.on("uncaughtException", () => {
//   console.log(`😈 uncaughtException is detected, Shutting Down the Server`);
//   process.exit(1);
// });
