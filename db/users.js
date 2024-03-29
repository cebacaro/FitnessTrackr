/* eslint-disable no-useless-catch */
const client = require("./client");
const bcrypt = require("bcrypt");

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashpassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password)
      VALUES($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
      `,
      [username, hashpassword]
    );
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  const userByUsername = await getUserByUsername(username);
  const hashedPassword = userByUsername.password;
  const isValid = await bcrypt.compare(password, hashedPassword);
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT id, username, password 
     FROM users
     WHERE id=${userByUsername.id}
     
     `
    );
    if (!isValid) {
      console.log("Invalid username and password");
      // throw {
      //   name: "UserNotFoundError",
      //   message: "Invalid username and password",
      // };
      return null;
    } else {
      delete user.password;
      return user;
    }
  } catch (error) {
    throw { error };
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT id, username
      FROM users
      WHERE id = $1`,
      [userId]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT * 
      FROM users 
      WHERE username = $1;
      `,
      [userName]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
