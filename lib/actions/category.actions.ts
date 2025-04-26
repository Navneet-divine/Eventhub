"use server"
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";
import { connectToDB } from "../db";

export const createCategory = async (categoryName: string) => {
    try {
        await connectToDB()
        if (!categoryName.trim()) {
            throw new Error("Category name cannot be empty");
        }

        const allCategories = await Category.find({})

        const existedCategory = allCategories.find(cat => {
            return cat.name === categoryName
        })

        if (existedCategory) {
            throw new Error("Category already exists")
        }

        const newCategory = await Category.create({
            name: categoryName,
        });


        revalidatePath("/events/create-event");

        return JSON.parse(JSON.stringify(newCategory))

    } catch (error) {
        console.error("Error creating category:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message || "Something went wrong" };
        }

        return { success: false, error: "Something went wrong" };
    }
};

export const getCategories = async () => {
    try {
        await connectToDB()
        const allCategories = await Category.find({})
        console.log(allCategories)

        return JSON.parse(JSON.stringify(allCategories))
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message || "Something went wrong" };
        }
    }
}
