const express = require("express");

const { getTaskStats } = require("../controllers/statsController");

const router = express.Router();

router.get("/tasks", getTaskStats);

module.exports = router;
