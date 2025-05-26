import mongoose from "mongoose"

export const connectToDB = async function(){
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log('Connected to DB', connectionInstance.connection.host);
    } catch (error) {
        console.log('DB connection failed', error);
        process.exit(1)
    }
}

export {connectToDB}