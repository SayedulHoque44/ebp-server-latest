import cron from "node-cron";
import { userLogsModel } from "../modules/User/user.model";
export const deleteOldUserLogs = () => {
  // Schedule the cron job to run every minute
  // Format: "* * * * *" (minute, hour, day of month, month, day of week)
  cron.schedule("0 0 * * *", async () => {
    console.log("Running cron job to delete old user logs...");

    try {
      // Calculate the timestamp for 5 minutes ago
      const timeAgoToDelete = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Query to delete logs where `createdAt` is older than 5 minutes
      const result = await userLogsModel.deleteMany({
        createdAt: { $lt: timeAgoToDelete },
      });

      // Log the number of deleted records
      console.log(`Deleted ${result.deletedCount} old user logs.`);
    } catch (error) {
      // Log any errors that occur during the cron job
      console.error("Error while deleting old user logs:", error);
    }
  });

  console.log("Cron job to delete old user logs has been scheduled.");
};
