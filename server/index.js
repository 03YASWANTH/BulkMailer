const { connectDB } = require("./config/connectDatabase");
const express = require("express");
const app = express();
app.use(express.json());
app.use(require("cors")());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const {userRouter}= require("./routes/userRouter");



require("dotenv").config({
  path: "./.env",
});

app.use(require("body-parser").json());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", userRouter);


app.listen(process.env.PORT, () => {
  console.log("Server is running on port",process.env.PORT);
});