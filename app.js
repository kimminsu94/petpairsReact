const express = require("express");
const app = express();
const cors = require("cors");
const port = 4000;
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(
  cors({
    origin: true,
    Methods: ["POST", "GET", "OPTIONS", "DELETE"],
    credentials: true,
  })
);

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const petRouter = require("./routes/pet");
app.use("/pet", petRouter);

// app.use("/", express.static("uploads/"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
