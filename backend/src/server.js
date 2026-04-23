const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const { connectToDatabase } = require("./config/db");

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
}

startServer();
