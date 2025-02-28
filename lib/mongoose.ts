import "@/database";
import mongoose, { Mongoose } from "mongoose";
const MONGODB_URI = process.env.MONGODB_URL as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

interface MongooseCache {
  connection: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongdbConnection: MongooseCache;
}

let cached = global.mongdbConnection;

if (!cached) {
  cached = global.mongdbConnection = { connection: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "codeflow",
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  cached.connection = await cached.promise;

  return cached.connection;
};

export default dbConnect;
