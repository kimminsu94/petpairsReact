const express = require("express");
const router = express.Router();
const controllers = require("../controllers/pet");

router.post("/createPet", controllers.createPet);
router.post("/updatePetPhotoFile", controllers.updatePetPhotoFile);
router.delete("/petPhotoFileDelete", controllers.petPhotoFileDelete);
router.post("/petLike", controllers.petLike);

module.exports = router;
