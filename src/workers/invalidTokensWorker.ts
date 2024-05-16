import cron from "node-cron";
import { clearExpiredTokensFromDB } from "../controllers/tokensController";

// Schedule the route to run every day at midnight.
export const ScheduleInvalidTokensWorker = () => {
    // Worker will run every day at midnight GMT time.
    cron.schedule("0 0 * * *", async () => {
        try {
            await clearExpiredTokensFromDB();
        } catch (error) {
            console.error("Error cleaning expired tokens:", error);
        }
    });
};
