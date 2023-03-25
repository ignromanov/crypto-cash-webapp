import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "";

let cachedDb: typeof mongoose | null = null;

async function connectToDatabase(): Promise<typeof mongoose> {
  if (cachedDb) {
    return cachedDb;
  }

  cachedDb = await mongoose.connect(uri);

  return cachedDb;
}

export default connectToDatabase;
