const Task = require("../models/taskModel");

async function createTask(req, res, next) {
  try {
    const existingTask = await Task.findOne({
      title: req.body.title,
      projectId: req.body.projectId,
    }).lean();

    if (existingTask) {
      const error = new Error("A task with this title already exists in the project.");
      error.statusCode = 409;
      throw error;
    }

    const newTask = await Task.create(req.body);

    return res.status(201).json(newTask);
  } catch (error) {
    return next(error);
  }
}

async function getTasks(req, res, next) {
  try {
    const { status, projectId, assignedTo } = req.query;
    const filters = {};

    if (status) {
      filters.status = status;
    }

    if (projectId) {
      filters.projectId = projectId;
    }

    if (assignedTo) {
      filters.assignedTo = assignedTo;
    }

    const tasks = await Task.find(filters)
      .populate("projectId", "title courseCode status")
      .populate("assignedTo", "fullName email")
      .sort({ dueDate: 1 })
      .lean();

    return res.status(200).json(tasks);
  } catch (error) {
    return next(error);
  }
}

async function getTaskById(req, res, next) {
  try {
    const task = await Task.findById(req.params.id)
      .populate("projectId", "title courseCode status")
      .populate("assignedTo", "fullName email")
      .lean();

    if (!task) {
      const error = new Error("Task not found.");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      const error = new Error("Task not found.");
      error.statusCode = 404;
      throw error;
    }

    const duplicateTask = await Task.findOne({
      _id: { $ne: req.params.id },
      title: req.body.title,
      projectId: req.body.projectId,
    }).lean();

    if (duplicateTask) {
      const error = new Error("A task with this title already exists in the project.");
      error.statusCode = 409;
      throw error;
    }

    Object.assign(task, req.body);
    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id).lean();

    if (!deletedTask) {
      const error = new Error("Task not found.");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
