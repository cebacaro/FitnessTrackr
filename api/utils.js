function requireUser(req, res, next) {
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
