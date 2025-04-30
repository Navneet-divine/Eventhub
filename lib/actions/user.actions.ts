"use server";
import User from "@/models/User";
import { connectToDB } from "../db";

export async function getUserEvents(email: string) {
    try {
        if (!email) {
            throw new Error("Email is required to fetch user events");
        }
        await connectToDB();
        const user = await User.findOne({ email }).populate("events");

        if (!user) {
            throw new Error("User not found");
        }

        return JSON.parse(JSON.stringify(user.events));

    } catch (error) {
        console.error("Error fetching user events:", error);
        return null;
    }
}
