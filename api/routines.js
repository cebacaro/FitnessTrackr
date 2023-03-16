const express = require("express");
const { tr } = require("faker/lib/locales");

const router = express.Router();
const {
  destroyRoutine,
  getAllPublicRoutines,
  createRoutine,
  getRoutineById,
  updateRoutine,
  addActivityToRoutine,
} = require("../db");
const { requireUser } = require("./utils");

// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch (error) {
    next({
      name: "routinesError",
      message: "Something went wrong",
    });
  }
});

// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  // createRoutine({ creatorId, isPublic, name, goal }

  const routineData = {
    creatorId: req.user.id,
    isPublic: req.body.isPublic,
    name: req.body.name,
    goal: req.body.goal,
  };

  try {
    const createdRoutine = await createRoutine(routineData);
    if (createdRoutine) {
      res.send(createdRoutine);
    }
  } catch (error) {
    next({
      name: "PostRoutinesError",
      message: "Could not create routine",
    });
  }
});

// PATCH /api/routines/:routineId
router.patch("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const { isPublic, name, goal } = req.body;

  const updateFields = {};

  if (isPublic !== undefined) {
    updateFields.isPublic = isPublic;
  }
  if (name !== undefined) {
    updateFields.name = name;
  }
  if (goal !== undefined) {
    updateFields.goal = goal;
  }

  try {
    const _checkId = await getRoutineById(routineId);
    if (!_checkId) {
      next({
        name: "RoutineDoesNotExistsError",
        message: `Routine ${routineId} does not exist`,
      });
    } else if (_checkId.creatorId !== req.user.id) {
      res.status(403);
      next({
        name: "NotAuthorError",
        message: `User ${req.user.username} is not allowed to update ${_checkId.name}`,
      });
    } else {
      const updatedRoutine = await updateRoutine({
        id: routineId,
        ...updateFields,
      });
      if (updatedRoutine) {
        res.send(updatedRoutine);
      } else {
        next({
          name: "PatchingRoutineActivityError",
          message: "Could not update Routine",
        });
      }
    }
  } catch (error) {
    next({
      name: "PatchingRoutineError",
      message: "Could not update Routine",
    });
  }
});

// DELETE /api/routines/:routineId
router.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;

  try {
    const routine = await getRoutineById(routineId);
    if (req.user.id === routine.creatorId) {
      const updatedRoutine = await destroyRoutine(routineId);
      console.log(updatedRoutine, "!!!Updated routine!!!");
      res.send(updatedRoutine);
    } else {
      res.status(403);
      next({
        name: "NotAuthorError",
        message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
      });
    }
  } catch (error) {
    next({
      name: "DeleteError",
      message: "Can't delete routine",
    });
  }
});
// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", async (req, res, next) => {
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;
  try {
    const routineActivity = await addActivityToRoutine({
      routineId,
      activityId,
      count,
      duration,
    });

    res.send(routineActivity);
  } catch (error) {
    next({
      name: "ActivitiesError",
      message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
    });
  }
});

module.exports = router;
