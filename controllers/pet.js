const { uuid } = require("uuidv4");
const fs = require("fs");
const {
  pet: petModel,
  user: userModel,
  like: likeModel,
  petPhoto: petPhotoModel,
} = require("../models");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, `${uuid()}.png`);
    // cb 콜백함수를 통해 전송된 파일 이름 설정
  },
});
//`${uuid()}.png`

const upload = multer({ storage: storage }).array("image", 5);

module.exports = {
  createPet: async (req, res) => {
    const { userId, petName, breed, species, age, introduce } = req.body;
    console.log(req.cookies);

    if (!petName || !breed || !species || !age || !introduce) {
      return res.status(401).json({ message: "모든 정보를 기입해주세요." });
    }

    try {
      //펫을 이미 등록했었을 때

      if (!created) {
        return res.status(400).json({ message: "이미 펫을 등록하였습니다." });
      }

      return res
        .status(200)
        .json({ message: "펫을 등록하였습니다.", data: newPet });
    } catch (err) {
      return res.status(404).json({ message: "잘못된 요청입니다." });
    }
  },

  updatePetPhotoFile: async (req, res) => {
    upload(req, res, (err) => {
      console.log(req.body);
      console.log(req.files);
      const { petId } = req.body;
      if (err) {
        return res.status(404).json({ success: false, err });
      }
      // petPhotoModel.create({
      //   petId: petId,
      //   fileName: req.file.filename,
      // });
      // req.files.map()
      // petPhotoModel.create({
      //   fileName: req.files.filename,
      // });
      const files = [
        {
          id: 1,
          petId: 1,
          fileName: "e9587484-922b-4988-adca-3ba2c7691162.png",
        },
        {
          id: 2,
          petId: 1,
          fileName: "e9587484-922b-4988-adca-3ba2c7691162.png",
        },
      ];

      // const findPhoto = petPhotoModel.findAll();
      console.log(files);

      return res.status(200).json({ data: files });
    });
  },

  petPhotoFileDelete: async (req, res) => {
    const { fileName } = req.body;

    try {
      await petPhotoModel.destroy({
        where: {
          fileName: fileName,
        },
      });
      fs.unlink(`uploads/${fileName}`, (err) => err);

      return res.status(200).json({ message: "사진이 삭제되었습니다." });
    } catch (err) {
      return res.status(404).json({ message: "잘못된 요청입니다." });
    }
  },

  petLike: async (req, res) => {
    const { myId, otherPetId } = req.body;

    const findPetId = await petModel.findOne({
      where: {
        userId: myId,
      },
    });

    const [like, created] = await likeModel.findOrCreate({
      where: {
        petId: findPetId.id,
        liked: otherPetId,
      },
    });
    if (!created) {
      return res.status(400).json({ message: "이미 like를 누른 pet입니다." });
    }

    const otherPet = await likeModel.findAll({
      where: {
        petId: otherPetId,
      },
    });
    console.log("1234567890987632" + otherPet);

    return res.status(200).json({ message: "좋아요를 등록했습니다." });
  },

  petLikeDelete: async (req, res) => {},

  otherPetPhotoView: async (req, res) => {
    const token = req.headers.cookies["accessToken"];
    const verifyToken = token.verify(token, "Tnlqkf");

    const userId = verifyToken.user.id;

    const petId = await petModel.findOne({
      where: {
        userId: userId,
      },
    });

    const findOtherPhoto = await petPhotoModel.findAll();

    const userFilterPhotp = findOtherPhoto.filter(
      (photo) => photo.petId !== petId
    );

    return res.status(200).json({ data: userFilterPhotp });
  },

  petPhotoView: async (req, res) => {
    const { petId } = req.body;

    try {
      const findPhoto = await petPhotoModel.findAll({
        where: {
          petId: petId,
        },
      });

      return res.status(200).json({ data: findPhoto });
    } catch (err) {
      return res.status(404).json({ message: "잘못된 요청입니다." });
    }
  },
};
