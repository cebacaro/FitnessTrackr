const express = require("express");
const router = express.Router();
const { getAllActivities, createActivity } = require("../db");
const { requireUser } = require("./utils");

// GET /api/activities/:activityId/routines

// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next({
      name: "Error",
      message: "Something went wrong",
    });
  }
});

// POST /api/activities

router.post("/", requireUser, async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (name && description) {
      const activity = await createActivity({ name, description });
      res.send({ activity });
    }
  } catch (error) {
    next({
      name: "createActivityError",
      message: "Something when wrong",
    });
  }
});

// PATCH /api/activities/:activityId

module.exports = router;
