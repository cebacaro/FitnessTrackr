require("dotenv").config();
const express = require("express");
const app = express();
const apiRouter = require("./api/index");
const morgan = require("morgan");
const cors = require("cors");
// const { PORT = 3000 } = process.env;
// Setup your Middleware and API Router here

app.use(cors());
app.use(express.json());

app.use(morgan("dev"));

app.use("/api", apiRouter);

// app.listen(3000, () => {
//   console.log("server is up");
// });

// 404 handler
app.get("*", (req, res) => {
  res.status(404).send({
    name: "404 - Not Found",
    message: "No route found for the requested URL",
  });
});

// error handling middleware
app.use((error, req, res, next) => {
  console.error("SERVER ERROR: ", error);
  if (res.statusCode < 400) res.status(401);
  res.send({ name: error.name, message: error.message, error: error.message });
});

module.exports = app;
