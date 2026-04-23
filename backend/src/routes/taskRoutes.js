const express = require("express");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { validateTaskInput } = require("../middleware/validateTaskInput");

const router = express.Router();

router.post("/", validateTaskInput, createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", validateTaskInput, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
