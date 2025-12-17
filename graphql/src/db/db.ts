import mongoose from "mongoose"

async function connectDb() {
    await mongoose.connect('mongodb://localhost/notifications');
    console.log('DB connected succsesful');
}

connectDb();

const notification = new mongoose.Schema({
    name: String,
    description: String,
    isRead:String
})

export const notifications = mongoose.model('notifications', notification)