import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    await mongoose.connect(`${process.env.DB_CONNECT_STRING}`);
    console.log("Connect Database successfully");
  } catch (error) {
    console.log("Connect Database failure");
  }
};
export default connectDatabase;
