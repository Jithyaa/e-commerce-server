import mongoose from "mongoose";

const connect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_STRING);
        console.log("database connected");
    } catch (error) {
        console.log("Error connecting db",error.message);
    }

}

export default connect;