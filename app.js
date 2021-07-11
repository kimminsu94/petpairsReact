const express = require("express");
const app = express();
const cors = require("cors");
const https = require("https");

const cookieParser = require("cookie-parser");

const passport = require("passport");
const passportConfig = require("./controllers/passport");
app.use(passport.initialize());
passportConfig();

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.json());
const port = 4000;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(
  cors({
    origin: true,
    Methods: ["POST", "GET", "OPTIONS"],
    credentials: true,
    // headers: {
    //   "Content-Type": "application/json",
    // },
  })
);

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const petRouter = require("./routes/pet");
app.use("/pet", petRouter);

app.use("/pet", express.static("uploads/"));

https
  .createServer(
    {
      key: fs.readFileSync(__dirname + "/key.pem", "utf-8"),
      cert: fs.readFileSync(__dirname + "/cert.pem", "utf-8"),
    },
    app.use("/", (req, res) => {
      res.send("Congrats! You made https server now :)");
    })
  )
  .listen(port);
