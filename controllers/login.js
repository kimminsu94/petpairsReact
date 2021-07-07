const jwt = require("jsonwebtoken");
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();

exports.create = (req, res) => {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET);
      res.cookie("accessToken", accessToken, { httpOnly: true });
      return res.json({ data: user.dataValues, accessToken: accessToken });
    });
  })(req, res);
};
