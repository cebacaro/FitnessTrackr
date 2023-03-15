/* eslint-disable no-useless-catch */
const express = require("express");
const { getUserByUsername, createUser } = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      next({
        name: "NeedAllFieldsError",
        message: "Require a username AND a password to register",
      });
    }

    if (password.length < 8) {
      next({
        name: "PasswordLengthError",
        message: "Password must be at least 8 characters",
      });
    }

    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "That username already exists",
      });
    }

    const user = await createUser({ username, password });

    const token = jwt.sign(
      {
        username: user.username,
        password: user.password,
      },
      process.env.JWT_SECRET
    );

    res.send({
      message: "Thank you for registering",
      token,
    });
  } catch (error) {
    throw error;
  }
});

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
