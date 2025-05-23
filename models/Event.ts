import { Document, Schema, model, models } from "mongoose";

export interface IEvent extends Document {
    _id: string;
    title: string;
    description?: string;
    location?: string;
    createdAt: Date;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    price: string;
    isFree: boolean;
    url?: string;
    category: string
    organizer: { _id: string, firstName: string }
    bookedBy: string
}

const EventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    createdAt: { type: Date, default: Date.now },
    imageUrl: { type: String, required: true },
    startDateTime: { type: Date, default: Date.now },
    endDateTime: { type: Date, default: Date.now },
    price: { type: String },
    isFree: { type: Boolean, default: true },
    url: { type: String },
    category: String,
    organizer: { type: Schema.Types.ObjectId, ref: 'User' },
    bookedBy: {
        type: Schema.Types.ObjectId, ref: "User"
    },
    isBooked: {
        type: Boolean,
        default: false
    }

})

const Event = models.Event || model('Event', EventSchema);

export default Event;