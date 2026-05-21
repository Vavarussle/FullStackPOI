import * as dotenv from "dotenv";
import Mongoose from "mongoose";
import * as mongooseSeeder from "mais-mongoose-seeder";
import { seedData } from "./seed-data.js";

const seedLib = mongooseSeeder.default;
let isConnected = false;

async function seed() {
  const seeder = seedLib(Mongoose);
  const dbData = await seeder.seed(seedData, { dropDatabase: false, dropCollections: true });
  console.log(dbData);
}

export async function connectMongo() {
  if (isConnected) {
    return;
  }

  dotenv.config();
  Mongoose.set("strictQuery", true);
  try {
    await Mongoose.connect(process.env.mongoUri);
    isConnected = true;

    const db = Mongoose.connection;

    db.on("error", (err) => {
      console.log(`database connection error: ${err}`);
    });

    db.on("disconnected", () => {
      console.log("database disconnected");
      isConnected = false;
    });

    console.log(`database connected to ${db.name} on ${db.host}`);

    if (process.env.seedDatabase === "true") {
      await seed();
    }
  } catch (err) {
    console.log(`database connection error: ${err}`);
  }
}
