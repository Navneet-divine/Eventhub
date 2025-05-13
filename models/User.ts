import { Schema, models, model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface User {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    createdAt?: Date;
    updatedAt?: Date;
    color: string
    events: string[];
    bookedEvents: string[]
    phoneNo: string
    socials: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        linkedIn?: string;
    };

}

const userSchema = new Schema<User>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
    },
    color: {
        type: String,
    },
    password: {
        type: String,
    },
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event',
        }
    ],
    bookedEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: "Event"
        }
    ],
    phoneNo: {
        type: String
    },
    socials: {
        instagram: String,
        facebook: String,
        twitter: String,
        linkedIn: String

    }
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

const User = models.User || model('User', userSchema);
export default User;

