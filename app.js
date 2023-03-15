require("dotenv").config();
const express = require("express");
const app = express();
const apiRouter = require("./api/index");
// const { PORT = 3000 } = process.env;
// Setup your Middleware and API Router here

app.use(express.json());

app.use("/api", apiRouter);

app.listen(3000, () => {
  console.log("server is up");
});

module.exports = app;
