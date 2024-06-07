import mongoose from "mongoose";

const dbConn = async () => {
  try {
    const DB_STRING =
      process.env.MONGO_DB_ATLASS_URI && process.env.NODE_ENV === "production"
        ? process.env.MONGO_DB_ATLASS_URI
        : process.env.MONGO_DB_URI || "";
    await mongoose.connect(DB_STRING);
  } catch (err) {
    console.log(err);
  }
};

export default dbConn;
