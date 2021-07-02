const express = require("express");
const router = express.Router();
const controllers = require("../controllers/pet");
const passport = require("passport");

router.post(
  "/createPet",
  passport.authenticate("jwt", { session: false }),
  controllers.createPet
);
router.post("/updatePetPhotoFile", controllers.updatePetPhotoFile);
router.delete("/petPhotoFileDelete", controllers.petPhotoFileDelete);
router.post("/petLike", controllers.petLike);

module.exports = router;
