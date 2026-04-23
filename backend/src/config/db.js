const mongoose = require("mongoose");

async function connectToDatabase() {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in environment variables.");
  }

  await mongoose.connect(MONGODB_URI, {
    dbName: "fullstack_lab",
  });

  return mongoose.connection;
}

module.exports = {
  connectToDatabase,
};
