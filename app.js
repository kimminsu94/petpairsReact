const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["https://petpairs-client.vercel.app/"],
    Methods: ["POST", "GET", "OPTIONS"],
    credentials: true,
    header: "*",
    optionsSuccessStatus: 200,
  })
);

const passport = require("passport");
const passportConfig = require("./controllers/passport");
app.use(passport.initialize());
passportConfig();

const port = 8080;

app.get("/", (req, res) => {
  res.send("hello world");
});

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const petRouter = require("./routes/pet");
app.use("/pet", petRouter);

app.use("/pet", express.static("uploads/"));

http.createServer(app).listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
