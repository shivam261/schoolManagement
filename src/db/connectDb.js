import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDatabase = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(`Mongo db connected for database ${DB_NAME}`);
  } catch (error) {
    console.error("CONNECTION FAILED : ", error);
    process.exit(1);
  }
};
export default connectDatabase;
