const Task = require("../models/taskModel");

// GET /api/stats/tasks
async function getTaskStats(_req, res, next) {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          avgPriority: { $avg: "$priorityScore" },
          totalHours: { $sum: "$estimatedHours" },
        },
      },
    ]);

    // build a nicer response object
    const byStatus = { todo: 0, in_progress: 0, done: 0 };
    let totalTasks = 0;
    let totalHours = 0;
    let prioritySum = 0;

    stats.forEach((entry) => {
      byStatus[entry._id] = entry.count;
      totalTasks += entry.count;
      totalHours += entry.totalHours;
      prioritySum += entry.avgPriority * entry.count;
    });

    const avgPriority = totalTasks > 0
      ? Math.round((prioritySum / totalTasks) * 10) / 10
      : 0;

    return res.status(200).json({
      byStatus,
      totalTasks,
      totalEstimatedHours: totalHours,
      avgPriority,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getTaskStats,
};
