const { user: userModel, pet: petModel } = require("../models");

module.exports = {
  signup: async (req, res) => {
    console.log(req.body);
    const { userName, email, password } = req.body;

    try {
      if (!userName || !email || !password) {
        return res.status(400).json({ message: "모든 정보를 기입해주세요." });
      } else {
        const [newUser, created] = await userModel.findOrCreate({
          where: {
            email: email,
          },
          defaults: {
            password: password,
            userName: userName,
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

  login: async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "이메일이 존재하지 않습니다." });
    } else if (!password) {
      return res.status(400).json({ message: "잘못된 패스워드입니다." });
    }

    try {
      const user = await userModel.findOne({
        where: {
          email: email,
          password: password,
        },
        include: [{ all: true }],
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "잘못된 사용자 또는 잘못된 암호입니다." });
      }

      console.log(user);
      delete user.password;
      return res.status(200).json({ data: user });
    } catch (err) {
      console.log(err);
      return res
        .status(404)
        .json({ message: "잘못된 사용자 또는 잘못된 암호입니다." });
    }
  },

  signout: async (req, res) => {},

  userOrPetEdit: async (req, res) => {
    const { id, petId, name, email, petName, species, breed, age, introduce } =
      req.body;
    console.log(req.body);
    if (
      !name ||
      !email ||
      !petName ||
      !species ||
      !breed ||
      !age ||
      !introduce
    ) {
      return res.status(400).json({ message: "모든 정보를 기입해주세요." });
    }

    try {
      await userModel.update(
        {
          userName: name,
          email: email,
        },
        {
          where: {
            id: id,
          },
        }
      );

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
      const editUser = await userModel.findOne({
        where: {
          id: id,
        },
      });
      return res.status(200).json({ data: editUser });
    } catch (err) {
      return res.status(404).json({ message: "잘못된 요청입니다." });
    }
  },

  userDelete: async (req, res) => {
    const { id } = req.body;
    console.log(req.body);
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
    const { id } = req.body;

    try {
      const findUser = await userModel.findOne({
        where: {
          id: id,
        },
        include: [{ all: true }],
      });
      return res.status(200).json({ data: findUser });
    } catch (err) {
      return res.status(404).json({ message: "잘못된 요청입니다." });
    }
  },
  allFindPet: async (req, res) => {
    const findall = await petModel.findAll();
    return res.json({ findall });
  },
};
