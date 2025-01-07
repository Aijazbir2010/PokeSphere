import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27071/PokéSphere'

let isConnected: boolean | number = false

export const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState
  } catch (error) {
    throw new Error("Database connection failed")
  }
}
