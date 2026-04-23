const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../app");
const { seed } = require("../seeds/seedData");
const User = require("../models/userModel");
const Project = require("../models/projectModel");
const Task = require("../models/taskModel");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  const mongoServer = await MongoMemoryServer.create();

  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.NODE_ENV = "test";

  try {
    await seed();

    const userCount = await User.countDocuments();
    const projectCount = await Project.countDocuments();
    const taskCount = await Task.countDocuments();

    assert(userCount >= 5, "Expected at least 5 users in seed data.");
    assert(projectCount >= 5, "Expected at least 5 projects in seed data.");
    assert(taskCount >= 5, "Expected at least 5 tasks in seed data.");

    const user = await User.findOne().lean();
    const project = await Project.findOne().lean();

    const createPayload = {
      title: "Prepare API demo flow",
      details: "Document one end-to-end route for seminar explanation.",
      status: "todo",
      dueDate: "2026-05-08",
      priorityScore: 8,
      estimatedHours: 3,
      projectId: String(project._id),
      assignedTo: String(user._id),
    };

    const postResponse = await request(app).post("/api/tasks").send(createPayload);
    assert(postResponse.status === 201, "POST /api/tasks should return 201.");

    const createdId = postResponse.body._id;

    const getListResponse = await request(app)
      .get("/api/tasks")
      .query({ projectId: String(project._id) });
    assert(getListResponse.status === 200, "GET /api/tasks should return 200.");
    assert(Array.isArray(getListResponse.body), "GET /api/tasks should return an array.");

    const getOneResponse = await request(app).get(`/api/tasks/${createdId}`);
    assert(getOneResponse.status === 200, "GET /api/tasks/:id should return 200.");

    const putResponse = await request(app).put(`/api/tasks/${createdId}`).send({
      ...createPayload,
      title: "Prepare complete API seminar demo",
      status: "in_progress",
      priorityScore: 9,
    });
    assert(putResponse.status === 200, "PUT /api/tasks/:id should return 200.");

    const duplicateResponse = await request(app).post("/api/tasks").send({
      ...createPayload,
      title: "Prepare complete API seminar demo",
    });
    assert(duplicateResponse.status === 409, "Duplicate task should return 409.");

    const badInputResponse = await request(app).post("/api/tasks").send({
      title: "No",
      dueDate: "invalid-date",
      priorityScore: 99,
      projectId: "",
      assignedTo: "",
    });
    assert(badInputResponse.status === 400, "Invalid payload should return 400.");

    const invalidIdResponse = await request(app).get("/api/tasks/123");
    assert(invalidIdResponse.status === 400, "Invalid id format should return 400.");

    const deleteResponse = await request(app).delete(`/api/tasks/${createdId}`);
    assert(deleteResponse.status === 200, "DELETE /api/tasks/:id should return 200.");

    const notFoundResponse = await request(app).get(`/api/tasks/${createdId}`);
    assert(notFoundResponse.status === 404, "Deleted task fetch should return 404.");

    console.log("Day 1 smoke test passed.");
  } finally {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
}

run().catch((error) => {
  console.error("Day 1 smoke test failed:", error.message);
  process.exit(1);
});
