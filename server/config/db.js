import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`mongoDB Connected : ${connect.connection.host}  `);
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
};

export default connectDB
