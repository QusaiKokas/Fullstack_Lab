const dotenv = require("dotenv");

dotenv.config();

const { connectToDatabase } = require("../config/db");
const User = require("../models/userModel");
const Project = require("../models/projectModel");
const Task = require("../models/taskModel");

async function seed() {
  await connectToDatabase();

  await Task.deleteMany({});
  await Project.deleteMany({});
  await User.deleteMany({});

  const users = await User.insertMany([
    {
      fullName: "Emma Lundqvist",
      email: "emma.lundqvist@student.hkr.se",
      role: "team_lead",
      studyProgram: "Software Development",
    },
    {
      fullName: "Noah Svensson",
      email: "noah.svensson@student.hkr.se",
      role: "student",
      studyProgram: "Software Development",
    },
    {
      fullName: "Sara Lindberg",
      email: "sara.lindberg@student.hkr.se",
      role: "student",
      studyProgram: "Digital Design",
    },
    {
      fullName: "Hugo Nilsson",
      email: "hugo.nilsson@student.hkr.se",
      role: "student",
      studyProgram: "Network Security",
    },
    {
      fullName: "Maja Karlsson",
      email: "maja.karlsson@student.hkr.se",
      role: "team_lead",
      studyProgram: "Software Development",
    },
  ]);

  const projects = await Project.insertMany([
    {
      title: "Campus Study Room Booking",
      courseCode: "DA219B",
      description: "Web app for booking group study rooms with availability overview.",
      deadline: new Date("2026-05-20"),
      status: "in_progress",
      ownerId: users[0]._id,
    },
    {
      title: "Internship Portfolio Tracker",
      courseCode: "DA216A",
      description: "Track internship goals, weekly updates, and supervisor feedback.",
      deadline: new Date("2026-06-10"),
      status: "planning",
      ownerId: users[4]._id,
    },
    {
      title: "Student Budget Planner",
      courseCode: "DA220C",
      description: "Helps students manage rent, food, and monthly spending plans.",
      deadline: new Date("2026-05-30"),
      status: "in_progress",
      ownerId: users[2]._id,
    },
    {
      title: "Lab Equipment Inventory",
      courseCode: "DA210B",
      description: "Dashboard for tracking available lab devices and reservation status.",
      deadline: new Date("2026-06-15"),
      status: "planning",
      ownerId: users[3]._id,
    },
    {
      title: "Seminar Attendance Analyzer",
      courseCode: "DA208A",
      description: "Visualizes seminar attendance trends and missed session patterns.",
      deadline: new Date("2026-05-27"),
      status: "done",
      ownerId: users[1]._id,
    },
  ]);

  await Task.insertMany([
    {
      title: "Create MongoDB schemas",
      details: "Define user, project, and task schemas with references.",
      status: "done",
      dueDate: new Date("2026-04-20"),
      priorityScore: 8,
      estimatedHours: 4,
      projectId: projects[0]._id,
      assignedTo: users[0]._id,
    },
    {
      title: "Implement authentication screens",
      details: "Build login and registration views in React.",
      status: "in_progress",
      dueDate: new Date("2026-04-29"),
      priorityScore: 7,
      estimatedHours: 6,
      projectId: projects[1]._id,
      assignedTo: users[1]._id,
    },
    {
      title: "Design dashboard wireframes",
      details: "Prepare layout proposals for the budget overview page.",
      status: "todo",
      dueDate: new Date("2026-04-28"),
      priorityScore: 6,
      estimatedHours: 3,
      projectId: projects[2]._id,
      assignedTo: users[2]._id,
    },
    {
      title: "Add API error handling",
      details: "Return clear status codes and JSON error messages.",
      status: "in_progress",
      dueDate: new Date("2026-04-30"),
      priorityScore: 9,
      estimatedHours: 5,
      projectId: projects[3]._id,
      assignedTo: users[3]._id,
    },
    {
      title: "Write seminar demo checklist",
      details: "List CRUD and live-change scenarios to practice.",
      status: "todo",
      dueDate: new Date("2026-05-02"),
      priorityScore: 5,
      estimatedHours: 2,
      projectId: projects[4]._id,
      assignedTo: users[4]._id,
    },
  ]);

  console.log("Seed completed with users, projects, and tasks.");
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Seed failed:", error.message);
      process.exit(1);
    });
}

module.exports = {
  seed,
};
