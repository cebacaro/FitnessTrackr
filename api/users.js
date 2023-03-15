/* eslint-disable no-useless-catch */
const express = require("express");
const {
  getUserByUsername,
  createUser,
  getAllRoutinesByUser,
} = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils");

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
    next(error);
  }
});

// POST /api/users/login

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "loginError",
      message: "Please enter username and password",
    });
  }
  try {
    const user = await getUserByUsername(username);

    if (user && user.password === password) {
      const token = jwt.sign(
        {
          username: username,
          password: password,
        },
        process.env.JWT_SECRET
      );
      res.send({
        message: "you are logged in!",
        token,
      });
    } else {
      next({
        name: "incorrectCredentials",
        message: "Username and password are incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// GET /api/users/me
router.get("/me", async (req, res, next) => {
  try {
    const user = await getUserByUsername(req.user.username);

    if (!user) {
      next({
        name: "NotValidUserError",
        message: "No user by that username",
      });
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:username/routines
router.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;
  console.log(username);

  try {
    const routines = await getAllRoutinesByUser(username);
    console.log(routines);

    res.send(routines);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
