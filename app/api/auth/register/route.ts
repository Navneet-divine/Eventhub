import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import { generateColor } from "@/utils/generateColor";


export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const avatarFile = formData.get("avatar") as File | null;

        await connectToDB();

        let avatarUrl = "";

        if (avatarFile) {
            const arrayBuffer = await avatarFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const base64String = `data:${avatarFile.type};base64,${buffer.toString("base64")}`;

            const uploadResponse = await cloudinary.uploader.upload(base64String, {
                folder: "Eventhub",
            });

            avatarUrl = uploadResponse.secure_url;
        }



        const color = generateColor(name)

        const user = await User.create({
            name,
            email,
            color,
            password,
            avatar: avatarUrl,
        });

        const res = NextResponse.json(user, { status: 201 });

        return res;
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json({ message: "Error creating user" }, { status: 500 });
    }
}
