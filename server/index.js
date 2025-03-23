const { connectDB } = require("./config/connectDatabase");
const express = require("express");
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('./config/passport');


//Import Routes
const {userRouter}= require("./routes/userRouter");
const authRoutes = require('./routes/auth');



require("dotenv").config({
  path: "./.env",
});

//middlewares
const cors = require("cors");
app.use(require("body-parser").json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(passport.initialize());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

//Routes

app.use("/api/user", userRouter);
app.use('/api/auth', authRoutes);


app.listen(process.env.PORT, () => {
  console.log("Server is running on port",process.env.PORT);
});