import { readFileSync } from "node:fs";
import mongoose from "mongoose";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }),
);

const MONGODB_URI = env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

const main = async () => {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  if (collections.length === 0) {
    console.log("No collections found — nothing to drop.");
  }

  for (const { name } of collections) {
    await db.dropCollection(name);
    console.log(`Dropped: ${name}`);
  }

  await mongoose.disconnect();
  console.log("Done. Fresh start — the app will recreate collections and indexes from the current schemas.");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
