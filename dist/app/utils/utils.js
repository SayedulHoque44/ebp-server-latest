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
exports.utils = exports.deleteOldUserLogs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const user_model_1 = require("../modules/User/user.model");
const deleteOldUserLogs = () => {
    // Schedule the cron job to run every minute
    // Format: "* * * * *" (minute, hour, day of month, month, day of week)
    node_cron_1.default.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Running cron job to delete old user logs...");
        try {
            // Calculate the timestamp for 5 minutes ago
            const timeAgoToDelete = new Date(Date.now() - 1 * 60 * 1000);
            // Query to delete logs where `createdAt` is older than 5 minutes
            const result = yield user_model_1.userLogsModel.deleteMany({
                createdAt: { $lt: timeAgoToDelete },
            });
            // Log the number of deleted records
            console.log(`Deleted ${result.deletedCount} old user logs.`);
        }
        catch (error) {
            // Log any errors that occur during the cron job
            console.error("Error while deleting old user logs:", error);
        }
    }));
    console.log("Cron job to delete old user logs has been scheduled.");
};
exports.deleteOldUserLogs = deleteOldUserLogs;
const dateFillterGteLte = (query, targetField) => {
    if (!targetField) {
        return {};
    }
    const isValidDate = (date) => !isNaN(Date.parse(date));
    // If both gte and lte exist and are valid
    if (query.gte &&
        isValidDate(query.gte) &&
        query.lte &&
        isValidDate(query.lte)) {
        return {
            [targetField]: {
                $gte: new Date(query.gte),
                $lte: new Date(query.lte),
            },
        };
    }
    // If only lte exists and is valid
    if (query.lte && isValidDate(query.lte)) {
        return {
            [targetField]: {
                $lte: new Date(query.lte),
            },
        };
    }
    // If only gte exists and is valid
    if (query.gte && isValidDate(query.gte)) {
        return {
            [targetField]: {
                $gte: new Date(query.gte),
            },
        };
    }
    // Default: return an empty object if no valid filters
    return {};
};
exports.utils = {
    dateFillterGteLte,
};
