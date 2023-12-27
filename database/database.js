import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      // eslint-disable-next-line no-undef
      `${process.env.MONGODB_URI}`
    );
    console.log(`\n MongoDB connected !! DB Host ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection error", error);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
};

export default connectDB;
