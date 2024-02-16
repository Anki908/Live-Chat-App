const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { globalErrorHandle } = require("./Middlewares/globalErrorHandle");
const userRouter = require("./Routes/userRoutes");
const cookieParser = require('cookie-parser');
require('express-async-errors');

dotenv.config({ path: "./config.env" });

const db = process.env.DATABASE;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user" , userRouter);

app.use("*", (req, res) => {
  res.status(400).json({
    msg: "Route Not Found",
  });
});

app.use(globalErrorHandle);

try {
  mongoose.connect(db);
  console.log("DB connected");
  app.listen(5100, () => {
    console.log("server started");
  });
} catch (err) {
  console.log("Connection failed");
}
