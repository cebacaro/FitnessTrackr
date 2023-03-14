/* eslint-disable no-useless-catch */
const client = require("./client");
const { getRoutineById } = require("./routines");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine_activities],
    } = await client.query(
      `
    INSERT INTO routine_activities("routineId","activityId",count,duration)
    VALUES($1,$2,$3,$4)
    RETURNING *;
    `,
      [routineId, activityId, count, duration]
    );

    return routine_activities;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [result],
    } = await client.query(`
    SELECT * 
    FROM routine_activities
    WHERE id = ${id}
    `);
    return result;
  } catch (error) {
    throw error;
  }
}

async function getroutine_activitiesByRoutine({ id }) {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM routine_activities
      WHERE "routineId"= ${id}
      
      `
    );
    console.log("getting routines by ID");
    return rows;
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, idx) => `"${key}"= $${idx + 1}`)
    .join(", ");

  try {
    if (setString.length > 0) {
      const {
        rows: [routineactivity],
      } = await client.query(
        `
      UPDATE routine_activities
      SET ${setString}
      WHERE id = ${id}
      RETURNING *
      `,
        Object.values(fields)
      );
      console.log(routineactivity);
      return routineactivity;
    }
  } catch (error) {
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [routineactivity],
    } = await client.query(
      `
        DELETE FROM routine_activities
        WHERE id = $1
        RETURNING *
      `,
      [id]
    );
    console.log(routineactivity, "!!!!!");
    return routineactivity;
  } catch (error) {
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const {
      rows: [routineactivity],
    } = await client.query(
      `
      SELECT *
      FROM routine_activities
      WHERE id=${routineActivityId}
    `
    );

    const routine = await getRoutineById(routineactivity.id);

    console.log(routine, "routine from canEditRoutineActivity");

    if (routine.creatorId === userId) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getroutine_activitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
