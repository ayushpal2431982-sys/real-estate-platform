import mongoose from "mongoose";


export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://ayushpal7388_db_user:34XiS2zG6jvLgZu7@cluster0.iae9bd7.mongodb.net/RealState")
    .then(() => {
        console.log("DB CONNECTED");
    })
}