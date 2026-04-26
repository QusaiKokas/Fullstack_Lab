const User = require("../models/userModel");

// GET /api/users
async function getUsers(_req, res, next) {
  try {
    const users = await User.find()
      .sort({ fullName: 1 })
      .lean();

    return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getUsers,
};
