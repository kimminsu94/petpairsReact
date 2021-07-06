const {
  user: userModel,
  pet: petModel,
  petPhoto: petPhotoModel,
  like: likeModel,
  matching: matchingModel,
} = require("../models");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { petPhotoFileDelete } = require("./pet");
const pet = require("./pet");

module.exports = {
  signup: async (req, res) => {
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

  //     delete user.password;
  //     return res.status(200).json({ data: user });
  //   } catch (err) {
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
    const { name, email } = req.body;
    const { petId, petName, species, breed, age, introduce } = req.body.pet;

    const token = req.cookies["accessToken"];

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

      const [pet, created] = await petModel.findOrCreate({
        where: {
          userId: verifyToken.id,
        },
        defaults: {
          petName: petName,
          breed: breed,
          species: species,
          age: age,
          introduce: introduce,
        },
      });

      if (!created) {
        await petModel.update(
          {
            petName: petName,
            breed: breed,
            species: species,
            age: age,
            introduce: introduce,
          },
          {
            where: {
              userId: verifyToken.id,
            },
          }
        );
      }

      const editFindUser = await userModel.findOne({
        where: {
          id: verifyToken.id,
        },
        row: true,
      });
      const editFindPet = await petModel.findOne({
        where: {
          userId: verifyToken.id,
        },
        row: true,
      });

      return res.status(200).json({ user: editFindUser, pet: editFindPet });
    } catch (err) {
      console.log(err);
      return res.status(404).json({ message: "잘못된 요청입니다." });
    }
  },

  userDelete: async (req, res) => {
    const token = req.cookies["accessToken"];
    const verifyToekn = jwt.verify(token, "Tnlqkf");

    try {
      await userModel.destroy({
        where: {
          id: verifyToekn.id,
        },
      });

      res.clearCookie("accessToken");
      // res.setcookie("accessToken", "", time() - 3600);
      return res.status(200).json({ message: "탈퇴했습니다." });
    } catch (err) {
      return res.status(404).json({ message: "잘못된 요청입니다." });
    }
  },

  userInfo: async (req, res) => {
    const token = req.cookies["accessToken"];
    const verifyToken = jwt.verify(token, "Tnlqkf");

    try {
      const findUser = await userModel.findOne({
        where: {
          id: verifyToken.id,
        },
        raw: true,
      });
      // console.log(findUser);

      const findPet = await petModel.findOne({
        where: {
          userId: verifyToken.id,
        },
        raw: true,
      });
      console.log(
        "--------------------------------------------------=--=--=------=-------"
      );
      console.log(findPet);
      if (!findPet) {
        return res.status(200).json({
          data: {
            user: findUser,
            pet: findPet,
            fileName: null,
          },
        });
      }

      const findPetPhoto = await petPhotoModel.findAll({
        where: {
          petId: findPet.id,
        },
        raw: true,
      });
      console.log(findPetPhoto);

      // const findPet = await petModel.findOne({
      //   where: {
      //     userId: verifyToken.id,
      //   },
      // });
      return res.status(200).json({
        data: {
          user: findUser,
          pet: findPet,
          fileName: findPetPhoto,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(404).json({ message: "잘못된 요청입니다." });
    }
  },

  allFindPet: async (req, res) => {
    const token = req.cookies["accessToken"];
    const verifyToken = jwt.verify(token, "Tnlqkf");

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
