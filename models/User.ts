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
        type: String, // We'll st
    },
    password: {
        type: String,
        required: true,
    },
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

