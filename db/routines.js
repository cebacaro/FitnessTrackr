/* eslint-disable no-useless-catch */
const { query } = require("express");
const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");
const {
  destroyRoutineActivity,
  getroutine_activitiesByRoutine,
} = require("./routine_activities");
async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES($1, $2, $3, $4)
      RETURNING *;
      `,
      [creatorId, isPublic, name, goal]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  // eslint-disable-next-line no-useless-catch
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      SELECT * 
      FROM routines
      WHERE id=${id}
      `
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM routines
      `
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

//Lauras hints: Might need user data, might need to call anouther function using the return
async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName" 
      FROM routines
      JOIN users ON users.id = routines."creatorId"
      
      `
    );

    const routinesWithActivities = attachActivitiesToRoutines(routines);
    return routinesWithActivities;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT routines.*, users.username AS "creatorName" 
    FROM routines
    JOIN users ON users.id = routines."creatorId"
    WHERE "isPublic" = true
    
 
    `);

    const routinesWithActivities = await attachActivitiesToRoutines(rows);
    return routinesWithActivities;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName" 
      FROM routines
      JOIN users ON users.id = routines."creatorId"
      WHERE username = $1
      
      `,
      [username]
    );

    const routinesWithActivities = await attachActivitiesToRoutines(rows);
    return routinesWithActivities;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName" 
      FROM routines
      JOIN users ON users.id = routines."creatorId"
      WHERE username = $1 AND "isPublic" = true;
      
      `,
      [username]
    );

    const routinesWithActivities = await attachActivitiesToRoutines(rows);
    return routinesWithActivities;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows } = await client.query(
      `
      SELECT DISTINCT routines.*, users.username AS "creatorName", routine_activities."activityId" 
      FROM routines
      JOIN users ON users.id = routines."creatorId"
      JOIN routine_activities on routine_activities."routineId" = routines.id 
      WHERE "activityId" = $1 AND "isPublic" = true;
      
      `,
      [id]
    );

    const routinesWithActivities = await attachActivitiesToRoutines(rows);
    return routinesWithActivities;
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, idx) => `"${key}"= $${idx + 1}`)
    .join(", ");

  try {
    if (setString.length > 0) {
      const {
        rows: [routine],
      } = await client.query(
        `
    UPDATE routines
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `,
        Object.values(fields)
      );
      return routine;
    }
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    const routineActivitiesToBeDestroyed = await getroutine_activitiesByRoutine(
      { id: id }
    );

    routineActivitiesToBeDestroyed.map((r, idx) => {
      destroyRoutineActivity(r.id);
    });

    const {
      rows: [destroyedRoutine],
    } = await client.query(
      `
        DELETE FROM routines
        WHERE id=${id}
        RETURNING *

      `
    );

    return destroyedRoutine;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
