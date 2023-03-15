function requireUser(req, res, next) {
  console.log(req.user, "req.user from requireUser function");
  if (!req.user) {
    next({
      name: "missingUserError",
      message: "You must be logged in to perform this action",
    });
  }
  next();
}

module.exports = {
  requireUser,
};
