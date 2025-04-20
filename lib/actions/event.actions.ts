"use server"

import Event from "@/models/Event"
import { connectToDB } from "../db"
import User from "@/models/User"
import { generateColor } from "@/utils/generateColor"
import cloudinary from "../cloudinary"

export async function createEvent(formData: FormData, userdata: any) {
    try {
        await connectToDB()


        console.log("Received FormData in server action:")
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${typeof value === "object" ? "File object" : value}`)
        }

        const existingUser = await User.findOne({ email: userdata.email })

        let currentUser

        if (!existingUser) {
            const newUserData = {
                name: userdata.name,
                email: userdata.email,
                avatar: userdata.image,
                color: generateColor(userdata.name),
                password: userdata.id,
            }

            const newUser = await User.create(newUserData)
            currentUser = newUser
        } else {
            currentUser = existingUser
        }


        const eventData: Record<string, any> = {}
        for (const [key, value] of formData.entries()) {
            if (key !== "imageUrl") {
                eventData[key] = value
            }
        }

        let imageUrl = ""

        const imageFile = formData.get("imageUrl")
        if (imageFile && imageFile instanceof File) {

            try {
                const arrayBuffer = await imageFile.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                const base64String = `data:${imageFile.type};base64,${buffer.toString("base64")}`

                const uploadResponse = await cloudinary.uploader.upload(base64String, {
                    folder: "Eventhub",
                })

                imageUrl = uploadResponse.secure_url
            } catch (uploadError) {
                console.error("Error uploading image to Cloudinary:", uploadError)
                throw new Error("Failed to upload image")
            }
        }
        const createdEvent = await Event.create({
            ...eventData,
            organizer: currentUser._id,
            imageUrl: imageUrl,
        })



        return JSON.parse(JSON.stringify(createdEvent))

    } catch (error) {
        console.error("Error in createEvent:", error)
        if (error instanceof Error) {
            return { success: false, error: error.message || "Something went wrong" }
        }
        return { success: false, error: "Something went wrong" }
    }
}

export async function getEventById(eventId: string) {
    try {

        if (!eventId) {
            throw new Error("did not get eventId")
        }

        const event = await Event.findById(eventId)

        if (!event) {
            throw new Error("Event does not exist")
        }

        return JSON.parse(JSON.stringify(event))

    } catch (error) {
        console.error("Error in createEvent:", error)
        if (error instanceof Error) {
            return { success: false, error: error.message || "Something went wrong" }
        }
        return { success: false, error: "Something went wrong" }
    }
}
