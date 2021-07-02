const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
let { user: userModel } = require("../models");

module.exports = () => {
  // Local Strategy
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({
            where: {
              email: email,
              password: password,
            },
          });
          if (!user) {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }
          return done(null, user, { message: "Logged In Successfully" });
        } catch (err) {
          console.log(err);
        }
      }
      // function (email, password, done) {
      //   // 이 부분에선 저장되어 있는 User를 비교하면 된다.
      //   return userModel
      //     .findOne({
      //       where: { email: email, password: password },
      //     })
      //     .then((user) => {
      //       if (!user) {
      //         return done(null, false, {
      //           message: "Incorrect email or password.",
      //         });
      //       }
      //       return done(null, user, { message: "Logged In Successfully" });
      //     })
      //     .catch((err) => done(err));
      // }
    )
  );

  const cookieExtractor = (req) => {
    let jwt = null;

    if (req && req.cookies) {
      jwt = req.cookies["accessToken"];
    }

    return jwt;
  };

  //JWT Strategy
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: "Tnlqkf",
      },
      (jwtPayload, done) => {
        return userModel
          .findOne({
            where: {
              email: jwtPayload.email,
            },
          })
          .then((user) => {
            return done(null, user.toJSON());
          })
          .catch((err) => {
            return done(err);
          });
      }
    )
  );
};
