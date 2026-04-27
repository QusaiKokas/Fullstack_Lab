const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../app");
const { seed } = require("../seeds/seedData");

function assert(condition, msg) {
  if (!condition) throw new Error(msg);
}

async function run() {
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.NODE_ENV = "test";

  try {
    await seed();

    // -- test GET /api/users --
    const usersRes = await request(app).get("/api/users");
    assert(usersRes.status === 200, "GET /api/users should return 200");
    assert(Array.isArray(usersRes.body), "users should be an array");
    assert(usersRes.body.length >= 5, "Should have at least 5 users");
    console.log("  ✓ GET /api/users");

    // -- test GET /api/projects --
    const projRes = await request(app).get("/api/projects");
    assert(projRes.status === 200, "GET /api/projects should return 200");
    assert(Array.isArray(projRes.body), "projects should be an array");
    assert(projRes.body.length >= 5, "Should have at least 5 projects");
    // check that owner is populated
    assert(projRes.body[0].ownerId.fullName, "ownerId should be populated with fullName");
    console.log("  ✓ GET /api/projects (with populated owner)");

    // -- test GET /api/projects/:id --
    const singleProjRes = await request(app).get(`/api/projects/${projRes.body[0]._id}`);
    assert(singleProjRes.status === 200, "GET /api/projects/:id should return 200");
    assert(singleProjRes.body.title, "Should have title");
    console.log("  ✓ GET /api/projects/:id");

    // -- test GET /api/projects with status filter --
    const filteredProjRes = await request(app).get("/api/projects").query({ status: "planning" });
    assert(filteredProjRes.status === 200, "filtered projects should return 200");
    filteredProjRes.body.forEach((p) => {
      assert(p.status === "planning", "All filtered projects should have status planning");
    });
    console.log("  ✓ GET /api/projects?status=planning");

    // -- test GET /api/stats/tasks --
    const statsRes = await request(app).get("/api/stats/tasks");
    assert(statsRes.status === 200, "GET /api/stats/tasks should return 200");
    assert(typeof statsRes.body.totalTasks === "number", "Should have totalTasks");
    assert(statsRes.body.byStatus, "Should have byStatus breakdown");
    assert(typeof statsRes.body.avgPriority === "number", "Should have avgPriority");
    assert(typeof statsRes.body.totalEstimatedHours === "number", "Should have totalEstimatedHours");
    console.log("  ✓ GET /api/stats/tasks");

    // -- test GET /api/tasks populate --
    const tasksRes = await request(app).get("/api/tasks");
    assert(tasksRes.status === 200, "GET /api/tasks should return 200");
    const firstTask = tasksRes.body[0];
    assert(firstTask.projectId?.title, "Task projectId should be populated");
    assert(firstTask.assignedTo?.fullName, "Task assignedTo should be populated");
    console.log("  ✓ GET /api/tasks (relational populate verified)");

    // -- test 404 on bad project id --
    const badId = "000000000000000000000000";
    const notFoundRes = await request(app).get(`/api/projects/${badId}`);
    assert(notFoundRes.status === 404, "Non-existent project should return 404");
    console.log("  ✓ GET /api/projects/:badId returns 404");

    console.log("\nAll endpoint tests passed!");
  } finally {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
}

run().catch((err) => {
  console.error("Endpoint test failed:", err.message);
  process.exit(1);
});
