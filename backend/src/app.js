const express = require("express");
const cors = require("cors");

const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stats", statsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
