const express = require("express");
const router = express.Router();
const { getAllActivities } = require("../db");

// GET /api/activities/:activityId/routines

// GET /api/activities
router.get("/", (req, res, next) => {
  try {
    const activities = getAllActivities();
    res.send(activities);
  } catch (error) {
    next({
      name: "Error",
      message: "Something went wrong",
    });
  }
});

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;
