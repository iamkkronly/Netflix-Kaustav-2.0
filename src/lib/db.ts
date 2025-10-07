import mongoose from 'mongoose';

// 1. Define an interface for our cached mongoose object.
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// 2. Extend the NodeJS Global type to declare a `mongoose` property.
// This allows us to access `global.mongoose` without TypeScript errors.
declare global {
  var mongoose: MongooseCache;
}

const MONGODB_URIS = [
  "mongodb+srv://g36plmn_db_user:gnQnhSzenkQ3gtYn@cluster0.aefevza.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  "mongodb+srv://l6yml41j_db_user:2m5HFR6CTdSb46ck@cluster0.nztdqdr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  "mongodb+srv://7afcwd6_db_user:sOthaH9f53BDRBoj@cluster0.m9d2zcy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
];

/**
 * Selects a random MongoDB URI from the list.
 * @returns {string} A randomly selected MongoDB URI.
 */
function getRandomUri(): string {
  const randomIndex = Math.floor(Math.random() * MONGODB_URIS.length);
  return MONGODB_URIS[randomIndex];
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const selectedUri = getRandomUri();

    cached.promise = mongoose.connect(selectedUri, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;