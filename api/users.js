/* eslint-disable no-useless-catch */
const express = require("express");
const {
  getUserByUsername,
  createUser,
  getAllRoutinesByUser,
  createRoutine,
  getPublicRoutinesByUser,
} = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils");
const bcrypt = require("bcrypt");

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      next({
        name: "NeedAllFieldsError",
        message: "Require a username AND a password to register",
      });
    } else if (password.length < 8) {
      next({
        name: "PasswordLengthError",
        message: "Password Too Short!",
      });
    } else {
      const _user = await getUserByUsername(username);

      if (_user) {
        next({
          error: "UserExistsError",
          message: `User ${username} is already taken.`,
          name: "UserExistsError",
        });
      } else {
        const user = await createUser({ username, password });

        const token = jwt.sign(
          {
            username: user.username,
            id: user.id,
          },
          process.env.JWT_SECRET
        );

        res.send({
          message: "Thank you for registering",
          token,
          user,
        });
      }
    }
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

    const isValid = bcrypt.compare(password, user.password);
    if (user && isValid) {
      const token = jwt.sign(
        {
          username: username,
          id: user.id,
        },
        process.env.JWT_SECRET
      );
      res.send({
        message: "you're logged in!",
        token,
        user,
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
router.get("/me", requireUser, async (req, res, next) => {
  try {
    console.log(req.user, "req user");
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
router.get("/:username/routines", requireUser, async (req, res, next) => {
  const { username } = req.params;
  console.log(username);

  try {
    if (req.user.username === username) {
      const routines = await getAllRoutinesByUser({ username });
      res.send(routines);
    } else {
      const routines = await getPublicRoutinesByUser({ username });
      res.send(routines);
    }
    const routines = await getPublicRoutinesByUser({ username });
    console.log(routines);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
