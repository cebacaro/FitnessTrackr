const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
const {
  getRoutineActivityById,
  updateRoutineActivity,
  getRoutineById,
  destroyRoutineActivity,
} = require("../db");

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;
  const { count, duration } = req.body;

  const updateFields = {};

  if (count !== undefined) {
    updateFields.count = count;
  }
  if (duration !== undefined) {
    updateFields.duration = duration;
  }

  try {
    const _checkId = await getRoutineActivityById(routineActivityId);
    const routine = await getRoutineById(_checkId.routineId);
    const creatorId = routine.creatorId;
    if (!_checkId) {
      next({
        name: "RoutineDoesNotExistsError",
        message: `Routine Activity ${routineActivityId} does not exist`,
      });
    } else if (creatorId !== req.user.id) {
      res.status(403);
      next({
        name: "NotAuthorError",
        message: `User ${req.user.username} is not allowed to update ${routine.name}`,
      });
    } else {
      const updatedRoutine = await updateRoutineActivity({
        id: routineActivityId,
        ...updateFields,
      });
      if (updatedRoutine) {
        res.send(updatedRoutine);
      } else {
        next({
          name: "PatchingRoutineError",
          message: "Could not update RoutineActivity 1",
        });
      }
    }
  } catch (error) {
    next({
      name: "PatchingRoutineError",
      message: "Could not update RoutineActivity 2",
    });
  }
});

// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;

  try {
    const routineActivity = await getRoutineActivityById(routineActivityId);
    const routine = await getRoutineById(routineActivity.routineId);

    if (req.user.id === routine.creatorId) {
      const updatedRoutineActivity = await destroyRoutineActivity(
        routineActivityId
      );

      res.send(updatedRoutineActivity);
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
      message: "Can't delete routine activity",
    });
  }
});

module.exports = router;
