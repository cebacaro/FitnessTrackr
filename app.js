require("dotenv").config();
const express = require("express");
const app = express();
const apiRouter = require("./index");
const { PORT = 3000 } = process.env;
// Setup your Middleware and API Router here

app.use(express.json());

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log("server is up", PORT);
});

module.exports = app;
