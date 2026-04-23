function validateTaskInput(req, _res, next) {
  const { title, dueDate, priorityScore, projectId, assignedTo } = req.body;

  if (!title || typeof title !== "string" || title.trim().length < 3) {
    const error = new Error("title is required and must be at least 3 characters.");
    error.statusCode = 400;
    return next(error);
  }

  if (!dueDate || Number.isNaN(new Date(dueDate).getTime())) {
    const error = new Error("dueDate is required and must be a valid date.");
    error.statusCode = 400;
    return next(error);
  }

  if (typeof priorityScore !== "number" || priorityScore < 1 || priorityScore > 10) {
    const error = new Error("priorityScore is required and must be between 1 and 10.");
    error.statusCode = 400;
    return next(error);
  }

  if (!projectId || typeof projectId !== "string") {
    const error = new Error("projectId is required.");
    error.statusCode = 400;
    return next(error);
  }

  if (!assignedTo || typeof assignedTo !== "string") {
    const error = new Error("assignedTo is required.");
    error.statusCode = 400;
    return next(error);
  }

  return next();
}

module.exports = {
  validateTaskInput,
};
