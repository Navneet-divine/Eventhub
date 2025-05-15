// lib/actions/user.actions.ts
"use server";
import User from "@/models/User";
import { connectToDB } from "../db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

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

export async function getUserByEmail(email: string) {
    try {
        console.log(email)
        await connectToDB()
        const user = await User.findOne({ email })

        if (!user) {
            throw new Error("user not found.")
        }

        return JSON.parse(JSON.stringify(user))
    } catch (error) {
        if (error instanceof Error) {
            return { succes: false, error: error.message || "Something went wrong" }
        }
        return { success: false, error: "Something went wrong" };
    }
}

export async function editProfile(email: string, formdata: FormData) {
    try {
        await connectToDB();

        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, error: "User not found." };
        }

        const newEmail = formdata.get("email") as string;
        const oldPassword = formdata.get("oldPassword") as string;
        const newPassword = formdata.get("newPassword") as string;
        const phoneNo = formdata.get("phoneNo") as string;
        console.log(phoneNo)

        // ✅ Update email if provided and different
        if (newEmail && newEmail !== user.email) {
            const existingUser = await User.findOne({ email: newEmail });
            if (existingUser) {
                return { success: false, error: "Email already in use." };
            }
            user.email = newEmail;
        }

        // ✅ Change password if both old and new are provided
        if (oldPassword || newPassword) {
            if (!oldPassword || !newPassword) {
                return { success: false, error: "Both old and new password are required." };
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return { success: false, error: "Old password is incorrect." };
            }
            user.password = newPassword;
        }


        if (phoneNo) {
            user.phoneNo = phoneNo;
        }


        await user.save();

        revalidatePath("/profile");

        return { success: true, message: "Profile updated successfully." };
    } catch (error) {
        console.error("editProfile error:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message || "Something went wrong." };
        }
        return { success: false, error: "Something went wrong." };
    }
}


export async function updateSocials(email: string, formData: FormData) {
    try {
        await connectToDB();

        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, error: "User not found." };
        }

        const instagram = formData.get("instagram") as string;
        const facebook = formData.get("facebook") as string;
        const twitter = formData.get("twitter") as string;
        const linkedIn = formData.get("linkedIn") as string;

     
        user.socials = {
            instagram,
            facebook,
            twitter,
            linkedIn,
        };

        revalidatePath("/profile")

        await user.save();

        return { success: true, message: "Socials updated successfully." };
    } catch (error) {
        console.error("updateSocials error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong.",
        };
    }
}









