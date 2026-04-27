/**
 * Starts the backend with an in-memory MongoDB so you can test
 * the full app locally without needing Atlas.
 *
 * Usage:  node src/tests/devMemory.js
 * Then open http://localhost:5173 with the Vite frontend running.
 */
const { MongoMemoryServer } = require("mongodb-memory-server");

async function main() {
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.PORT = process.env.PORT || "5000";
  process.env.NODE_ENV = "development";
  process.env.CORS_ORIGIN = "http://localhost:5173";

  // now require the seed and app after env is set
  const { seed } = require("../seeds/seedData");
  const app = require("../app");

  await seed();

  const PORT = Number(process.env.PORT);
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT} (in-memory DB)`);
    console.log("Press Ctrl+C to stop.");
  });
}

main().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});
