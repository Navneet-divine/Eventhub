// lib/actions/user.actions.ts
"use server";
import User from "@/models/User";
import { connectToDB } from "../db";

export async function getUserEvents(email: string, page = 1, limit = 8) {
    try {
        if (!email) {
            throw new Error("Email is required to fetch user events");
        }

        await connectToDB();

        const user = await User.findOne({ email }).populate({
            path: "events",
            options: {
                skip: (page - 1) * limit,
                limit: limit,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const totalEvents = await User.aggregate([
            { $match: { email } },
            { $project: { total: { $size: "$events" } } },
        ]);

        return {
            events: JSON.parse(JSON.stringify(user.events)),
            hasMore: (page * limit) < (totalEvents[0]?.total || 0),
        };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message || "Something went wrong" };
        }
        return { success: false, error: "Something went wrong" };
    }
}

export async function getUserBookedEvents(email: string, page = 1, limit = 8) {
    try {
        if (!email) {
            throw new Error("Email is required to fetch user events");
        }

        await connectToDB();

        const user = await User.findOne({ email }).populate({
            path: "bookedEvents",
            options: {
                skip: (page - 1) * limit,
                limit: limit,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const totalEvents = await User.aggregate([
            { $match: { email } },
            { $project: { total: { $size: "$events" } } },
        ]);

        return {
            events: JSON.parse(JSON.stringify(user.bookedEvents)),
            hasMore: (page * limit) < (totalEvents[0]?.total || 0),
        };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message || "Something went wrong" };
        }
        return { success: false, error: "Something went wrong" };
    }
}


