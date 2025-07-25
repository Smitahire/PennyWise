import mongoose from "mongoose"
import { DB_NAME } from "../constants.js";

const connectDB = async () =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        //const connectionInstance = await mongoose.connect('mongodb+srv://ahiresmit007:smit1234@cluster1.grh1e0i.mongodb.net/PennyWise')
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("ERROR: ",error);
        process.exit(1)
    }
}

export default connectDB 