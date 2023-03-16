const express = require("express");
const router = express.Router();
const {
  getAllActivities,
  createActivity,
  updateActivity,
  getPublicRoutinesByActivity,
  getActivityById,
  getActivityByName,
} = require("../db");
const { requireUser } = require("./utils");

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", (req, res, next) => {
  const { activityId } = req.params;

  try {
    const routines = getPublicRoutinesByActivity({ activityId });
    res.send(routines);
  } catch (error) {
    next({
      name: "Error",
      message: "Something went wrong",
    });
  }
});

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
  const { name, description } = req.body;
  try {
    if (name && description) {
      const activity = await createActivity({ name, description });
      console.log(activity);
      res.send(activity);
    }
  } catch (error) {
    next({
      name: "createActivityError",
      message: `An activity with name ${name} already exists`,
    });
  }
});

// PATCH /api/activities/:activityId
router.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;

  const updateFields = {};

  if (name) {
    updateFields.name = name;
  }

  if (description) {
    updateFields.description = description;
  }

  try {
    const _checkId = await getActivityById(activityId);
    const _checkName = await getActivityByName(name);
    if (!_checkId) {
      next({
        name: "ActivityDoesntExistError",
        message: `Activity ${activityId} not found`,
      });
    } else if (_checkName) {
      next({
        name: "ActivityNameTakenError",
        message: `An activity with name ${name} already exists`,
      });
    } else {
      const updatedActivity = await updateActivity({
        id: activityId,
        ...updateFields,
      });
      console.log(updatedActivity, "!!!!!!!");
      if (updateActivity) {
        res.send(updatedActivity);
      } else {
        next({
          name: "UpdateError",
          message: "Failed To Update Activity",
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
