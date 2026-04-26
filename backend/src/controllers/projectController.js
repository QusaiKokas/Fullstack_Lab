const Project = require("../models/projectModel");

// GET /api/projects
async function getProjects(req, res, next) {
  try {
    const filters = {};

    if (req.query.status) {
      filters.status = req.query.status;
    }

    if (req.query.ownerId) {
      filters.ownerId = req.query.ownerId;
    }

    const projects = await Project.find(filters)
      .populate("ownerId", "fullName email role")
      .sort({ deadline: 1 })
      .lean();

    return res.status(200).json(projects);
  } catch (err) {
    return next(err);
  }
}

// GET /api/projects/:id
async function getProjectById(req, res, next) {
  try {
    const project = await Project.findById(req.params.id)
      .populate("ownerId", "fullName email role")
      .lean();

    if (!project) {
      const err = new Error("Project not found.");
      err.statusCode = 404;
      throw err;
    }

    return res.status(200).json(project);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getProjects,
  getProjectById,
};
