import { encrypt } from "./encrypt";

export const generateResetPasswordLink = (userId: string): string => {
    if (!process.env.WEBSITE_URL) throw new Error("WEBSITE_URL is undefined");
    // TODO please sync this url with the frontend team.
    return process.env.WEBSITE_URL + "reset-password?token=" + encrypt.generateResetPasswordLinkData(userId);
};

export function CompareDates(date1: Date, date2: Date): boolean {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();
    return year1 === year2 && month1 === month2 && day1 === day2;
}
