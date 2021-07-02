const { user: userModel, pet: petModel } = require("../models");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const pet = require("./pet");

module.exports = {
  signup: async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;

    try {
      if (!name || !email || !password) {
        return res.status(400).json({ message: "모든 정보를 기입해주세요." });
      } else {
        const [newUser, created] = await userModel.findOrCreate({
          where: {
            email: email,
          },
          defaults: {
            password: password,
            userName: name,
          },
        });

        if (!created) {
          return res.status(400).json({ message: "존재하는 이메일입니다." });
        }

        return res.status(200).json({ message: "회원가입이 완료되었습니다." });
      }
    } catch (err) {
      return res.status(404).json({ message: "잘못된 요청입니다." });
    }
  },

  // login: async (req, res) => {
  //   console.log(req.body);
  //   const { email, password } = req.body;

  //   if (!email) {
  //     return res.status(400).json({ message: "이메일이 존재하지 않습니다." });
  //   } else if (!password) {
  //     return res.status(400).json({ message: "잘못된 패스워드입니다." });
  //   }

  //   try {
  //     const user = await userModel.findOne({
  //       where: {
  //         email: email,
  //         password: password,
  //       },
  //       include: [{ all: true }],
  //     });

  //     if (!user) {
  //       return res
  //         .status(400)
  //         .json({ message: "잘못된 사용자 또는 잘못된 암호입니다." });
  //     }

  //     console.log(user);
  //     delete user.password;
  //     return res.status(200).json({ data: user });
  //   } catch (err) {
  //     console.log(err);
  //     return res
  //       .status(404)
  //       .json({ message: "잘못된 사용자 또는 잘못된 암호입니다." });
  //   }
  // },

  // signout: async (req, res) => {
  //   const accessToken = req.cookies["accessToken"];

  //   const verifyToken = jwt.verify;
  // },

  userOrPetEdit: async (req, res) => {
    const { petId, name, email } = req.body;
    const { petName, species, breed, age, introduce } = req.body.pet;

    console.log(req.headers.cookie);
    const token = req.headers.cookie.substring(12);

    const verifyToken = jwt.verify(token, "Tnlqkf");

    if (
      !name ||
      !email ||
      !petName ||
      !species ||
      !breed ||
      !age ||
      !introduce
    ) {
      return res.status(400).json({ message: "dwefgrh" });
    }

    try {
      await userModel.update(
        {
          userName: name,
          email: email,
        },
        {
          where: {
            id: verifyToken.id,
          },
        }
      );

      if (petId) {
        await petModel.update(
          {
            petName: petName,
            species: species,
            breed: breed,
            age: age,
            introduce: introduce,
          },
          {
            where: {
              id: petId,
            },
          }
        );
      } else {
        await petModel.create({
          userId: verifyToken.id,
          petName: petName,
          breed: breed,
          species: species,
          age: age,
          introduce: introduce,
        });
      }

      const editUser = await userModel.findOne({
        where: {
          id: verifyToken.id,
        },
        include: [{ all: true }],
      });
      console.log(editUser.dataValues);
      return res.status(200).json({ data: editUser.dataValues });
    } catch (err) {
      return res.status(404).json({ message: "잘못된 요청입니다." });
    }
  },

  userDelete: async (req, res) => {
    const token = req.cookies["accessToken"];

    const verifyToekn = token.verify(token, "Tnlqkf");

    try {
      await userModel.destroy({
        where: {
          id: id,
        },
      });
      return res.status(200).json({ message: "탈퇴했습니다." });
    } catch (err) {
      return res.status(404).json({ message: "잘못된 요청입니다." });
    }
  },

  userInfo: async (req, res) => {
    const token = req.headers.cookie.substring(12);

    const verifyToken = jwt.verify(token, "Tnlqkf");

    try {
      const findUser = await userModel.findOne({
        where: {
          id: verifyToken.id,
        },
        include: [{ all: true }],
      });
      console.log(findUser);
      return res.status(200).json({ data: findUser });
    } catch (err) {
      return res.status(404).json({ message: "잘못된 요청입니다." });
    }
  },

  allFindPet: async (req, res) => {
    const findall = await petModel.findAll();
    return res.json({ findall });
  },

  signin: async (req, res) => {
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
        // jwt.sign('token내용', 'JWT secretkey')
        const token = jwt.sign(user, "Tnlqkf", { expiresIn: "30d" });
        return res.json({ user, token });
      });
    });
  },
};
