import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDB } from "@/lib/db";

export async function POST(req: NextRequest) {
    const { name, email, password } = await req.json();
    try {
        await connectToDB();
        const user = await User.create({ name, email, password });
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating user" }, { status: 500 });
    }
}