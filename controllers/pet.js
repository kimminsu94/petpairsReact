const { uuid } = require("uuidv4");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const {
  pet: petModel,
  user: userModel,
  like: likeModel,
  petPhoto: petPhotoModel,
  matching: matchingModel,
} = require("../models");
const dotenv = require("dotenv");
dotenv.config();
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
    const token = req.cookies["accessToken"];
    const verifyToken = jwt.verify(token, process.env.ACCESS_SECRET);

    const findPet = await petModel.findOne({
      where: {
        userId: verifyToken.id,
      },
    });

    upload(req, res, (err) => {
      const arrayFileName = req.files.map((file) => file.filename);

      for (const PhotoName of arrayFileName) {
        petPhotoModel.create({
          petId: findPet.id,
          petName: findPet.petName,
          fileName: PhotoName,
        });
      }
    });
    const findPhoto = await petPhotoModel.findAll({
      where: {
        petId: findPet.id,
      },
      raw: true,
    });
    return res.status(200).json({ data: findPhoto });
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
    const token = req.cookies["accessToken"];
    const verifyToken = jwt.verify(token, process.env.ACCESS_SECRET);
    const { otherPetId } = req.body;

    try {
      //본인의 펫
      const findPetId = await petModel.findOne({
        where: {
          userId: verifyToken.id,
        },
        raw: true,
      });

      //petId와 liked 둘 다 존재하지 않으면 like 생성
      const [like, created] = await likeModel.findOrCreate({
        where: {
          petId: findPetId.id,
          liked: otherPetId,
        },
        raw: true,
      });

      if (!created) {
        return res.status(400).json({ message: "이미 like를 누른 pet입니다." });
      }

      //상대 펫 찾기
      const otherPetLike = await likeModel.findOne({
        where: {
          petId: otherPetId,
          liked: findPetId.id,
        },
      });

      // like등록 후 매칭된 펫이 없을때
      if (!otherPetLike) {
        return res.status(200).json({ message: "좋아요를 등록했습니다." });
      }

      // 유저의 펫이 이미 매칭된 펫이 존재할때
      const matchingMyPetFind = await matchingModel.findOne({
        where: {
          petId: findPetId.id,
        },
      });

      // 상대펫이 이미 매칭된 펫이 존재할때
      const matchingOtherPetFind = await matchingModel.findOne({
        where: {
          petId: otherPetId,
        },
      });

      //유저의 펫이 이미 매칭된 펫이 존재할 경우 또는 상대펫이 이미 존재할경우
      if (matchingMyPetFind) {
        return res
          .status(200)
          .json({ message: "이미 매칭된 상대펫이 존재합니다." });
      } else if (matchingOtherPetFind) {
        return res
          .status(200)
          .json({ message: "상대펫이 이미 매칭되었습니다." });
      }

      //매칭db에 유저 정보 기입
      const [matchedMyPet, createdMyPetMatching] =
        await matchingModel.findOrCreate({
          where: {
            petId: findPetId.id,
          },
          defaults: {
            matchedId: otherPetId,
          },
        });

      //매칭db에 상대정보 기입
      const [matchedOtherPet, createdOtherPetMatching] =
        await matchingModel.findOrCreate({
          where: {
            petId: otherPetId,
          },
          defaults: {
            matchedId: findPetId.id,
          },
        });

      //상대 펫의 사진 가져오기
      const otherPetFileName = await petPhotoModel.findAll({
        where: {
          petId: matchedOtherPet.id,
        },
      });

      return res.status(200).json({
        data: {
          matchedPet: {
            petId: matchedOtherPet.id,
            petName: matchedOtherPet.petName,
            fileName: otherPetFileName,
          },
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(404).json({ message: "잘못된 요청입니다." });
    }
  },

  petLikeDelete: async (req, res) => {},

  otherPetPhotoView: async (req, res) => {
    const token = req.cookies["accessToken"];
    const verifyToken = jwt.verify(token, process.env.ACCESS_SECRET);
    try {
      const petId = await petModel.findOne({
        where: {
          userId: verifyToken.id,
        },
        raw: true,
      });

      const findOtherPhoto = await petPhotoModel.findAll({ raw: true });

      const userFilterPhoto = findOtherPhoto.filter(
        (photo) => photo.petId !== petId.id
      );

      const randomPetPhoto = userFilterPhoto.sort(() => {
        return Math.random() - Math.random();
      });
      console.log(randomPetPhoto);
      return res.status(200).json({ data: randomPetPhoto });
    } catch (err) {
      console.log(err);
      return res.status(404).json({ message: "잘못된 요청입니다." });
    }
  },

  // petPhotoView: async (req, res) => {
  //   const { petId } = req.body;

  //   try {
  //     const findPhoto = await petPhotoModel.findAll({
  //       where: {
  //         petId: petId,
  //       },
  //     });

  //     return res.status(200).json({ data: findPhoto });
  //   } catch (err) {
  //     return res.status(404).json({ message: "잘못된 요청입니다." });
  //   }
  // },
};
