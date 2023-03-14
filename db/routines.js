/* eslint-disable no-useless-catch */
const { query } = require("express");
const client = require("./client");

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
    console.log(routine);
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
      SELECT *
      FROM routines
      JOIN routine_activities ON id=activities."routineId" 
      
      `
    );
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

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
      console.log(routine, setString);
      return routine;
    }
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {}

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
