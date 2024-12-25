import mongoose, { Mongoose } from "mongoose";
const MONGODB_URI = process.env.MONOGDB_URI as string;

class DatabaseConnector {
  private static instance: DatabaseConnector;
  private connection: Mongoose | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConnector {
    if (!DatabaseConnector.instance) {
      DatabaseConnector.instance = new DatabaseConnector();
    }
    return DatabaseConnector.instance;
  }

  public async connect(): Promise<Mongoose> {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }
    if (this.connection) {
      return this.connection;
    }

    try {
      this.connection = await mongoose.connect(MONGODB_URI, {
        dbName: "database",
      });
      return this.connection;
    } catch (error) {
      throw new Error(String(error));
    }
  }
}

const database = DatabaseConnector.getInstance();
export default database;
