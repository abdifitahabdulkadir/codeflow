import mongoose, { Mongoose } from "mongoose";

// get mongodb connection string from env
const MONGODB_URI = process.env.MONOGDB_URI as string;

// if there is not mondob url then throw an error
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI IS NOT DEFINED");
}

interface MongooseCache {
  connection: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

export default async function dbConnect(): Promise<Mongoose> {
  if (cached.connection) {
    return cached.connection;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "codeflow",
      })
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  cached.connection = await cached.promise;

  return cached.connection;
}
