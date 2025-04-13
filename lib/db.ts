import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL!

if (!MONGODB_URL) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

export async function connectToDB() {
    try {
        await mongoose.connect(MONGODB_URL)
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("MONGODB CONNECTED");
        })

        connection.on('error', (err) => {
            console.log("MONGODB ERROR", err);
        })
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
