const express = require("express");

function requireUser(req, res, next) {
  console.log("Require user is being called");

  if (!req.user) {
    next({
      name: "missingUserError",
      message: "You must be Logged in",
    });
  }
  next();
}

module.export = {
  requireUser,
};
