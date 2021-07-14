const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");

const cookieParser = require("cookie-parser");

const passport = require("passport");
const passportConfig = require("./controllers/passport");
app.use(passport.initialize());
passportConfig();

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.json());
const port = 8080;

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

http.createServer(app).listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
