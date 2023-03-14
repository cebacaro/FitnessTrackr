/* eslint-disable no-useless-catch */
const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routinactivities],
    } = await client.query(
      `
    INSERT INTO routinactivities('routuneId','activityId','count','duration')
    VALUE($1,$2,$3,$4)
    RETURNING *;
    `,
      [routineId, activityId, count, duration]
    );

    return routinactivities;
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
    FROM routineactivities
    WHERE id = ${id},
    `);
    return result;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const {
      rows: [routineactivities],
    } = await client.query(
      `
      SELECT *
      FROM routineactivities
      WHERE "routineId"= ${id}
      RETURNING *
      `
    );
    console.log("getting routines by ID");
    return routineactivities;
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
      UPDATE routineactivities
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
      rows: [routineactivities],
    } = await client.query(
      `
        DELETE FROM routineactivities
        WHERE id = ${id}
      `
    );
    console.log(routineactivities);
    return routineactivities;
  } catch (error) {
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
