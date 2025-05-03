"use server"

import Event from "@/models/Event"
import { connectToDB } from "../db"
import User from "@/models/User"
import { generateColor } from "@/utils/generateColor"
import cloudinary from "../cloudinary"
import { revalidatePath } from "next/cache"

export async function createEvent(formData: FormData, userdata: any) {
    try {
        await connectToDB();

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

        const user = await User.findOne({ email: userdata.email })
        if (!user) {
            throw new Error("User does not exist")
        }

        user.events.push(createdEvent._id)
        await user.save()

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

        const event = await Event.findById(eventId).populate("organizer")
        console.log("Event found:", event)

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

export async function getAllEvent(limit = 8, query = "") {
    try {
        await connectToDB();

        let events;
        const searchQuery = query.trim() ? { title: { $regex: query.trim(), $options: "i" } } : {};

        events = await Event.find(searchQuery)
            .populate("organizer")
            .sort({ createdAt: "desc" })
            .limit(limit);

        const eventCount = await Event.countDocuments(searchQuery);

        if (!events) {
            throw new Error("Error fetching events");
        }

        return {
            data: JSON.parse(JSON.stringify(events)),
            totalPages: Math.ceil(eventCount / limit),
            success: true,
        };
    } catch (error) {
        console.error("Error in getAllEvent:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}



export async function editEvent(eventId: string, formData: FormData) {
    try {
        await connectToDB()

        console.log("Received FormData in server action for editing event:")
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${typeof value === "object" ? "File object" : value}`)
        }

        // Find the event to be edited
        const event = await Event.findById(eventId)
        if (!event) {
            throw new Error("Event does not exist")
        }

        const eventData: Record<string, any> = {}

        // Process FormData
        for (const [key, value] of formData.entries()) {
            if (key !== "imageUrl") {
                eventData[key] = value
            }
        }

        let imageUrl = event.imageUrl // Default to current imageUrl if no new image is uploaded

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

        // Update event with new data
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                ...eventData,
                imageUrl: imageUrl,
            },
            { new: true }
        )

        return JSON.parse(JSON.stringify(updatedEvent))

    } catch (error) {
        console.error("Error in editEvent:", error)
        if (error instanceof Error) {
            return { success: false, error: error.message || "Something went wrong" }
        }
        return { success: false, error: "Something went wrong" }
    }
}

export async function deleteEvent(eventId: string) {
    try {
        await connectToDB()
        const event = await Event.findByIdAndDelete(eventId)

        if (!event) {
            throw new Error("Event does not exist")
        }

        revalidatePath("/home")
        return JSON.parse(JSON.stringify(event))

    } catch (error) {
        console.error("Error in deleteEvent:", error)
        if (error instanceof Error) {
            return { success: false, error: error.message || "Something went wrong" }
        }
        return { success: false, error: "Something went wrong" }
    }
}

export async function getRelatedEvent(eventId: string) {
    try {
        await connectToDB();
        const event = await Event.findById(eventId);
        if (!event) {
            throw new Error("Event does not exist");
        }
        let relatedEvent: any[] = [];

        if (event.isFree) {
            relatedEvent = await Event.find({ isFree: true, _id: { $ne: eventId } });
        } else if (Number(event.price) > 0) {
            relatedEvent = await Event.find({ isFree: false, _id: { $ne: eventId } });
        } else if (event.price === "") {
            relatedEvent = [];
        } else if (Number(event.price) > 0 && event.isFree === true) {
            relatedEvent = await Event.find({ isFree: true, _id: { $ne: eventId } });
        } else if (Number(event.price) > 0) {
            relatedEvent = await Event.find({ isFree: false, _id: { $ne: eventId } });
        } else if (event.price === "") {
            relatedEvent = [];
        } else if (event.price === "" && event.isFree === false) {
            relatedEvent = await Event.find({ isFree: true, _id: { $ne: eventId } });
        }


        return JSON.parse(JSON.stringify(relatedEvent));
    } catch (error) {
        console.error("Error in getRelatedEvent:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message || "Something went wrong" };
        }
        return { success: false, error: "Something went wrong" };
    }
}

export async function toggleBookEvent(eventId: string, email: string) {
    try {
        await connectToDB();

        const event = await Event.findById(eventId);
        if (!event) {
            return { success: false, error: "Event not found" };
        }

        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, error: "User not found" };
        }

        const isAlreadyBooked = user.bookedEvents.some((eid: string) =>
            eid.toString() === eventId
        );

        if (isAlreadyBooked) {
            user.bookedEvents = user.bookedEvents.filter((eid: string) => eid.toString() !== eventId);
            event.isBooked = false;
            await user.save();
            await event.save();
            revalidatePath(`/events/event-detail/${eventId}`);
            return { success: true, message: "Event unbooked successfully" };
        } else {
            user.bookedEvents.push(eventId);
            event.isBooked = true;
            await user.save();
            await event.save();
            revalidatePath(`/events/event-detail/${eventId}`);
            return { success: true, message: "Event booked successfully" };
        }

    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message || "Something went wrong" };
        }
        return { success: false, error: "Something went wrong" };
    }
}





