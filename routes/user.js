const express = require("express");
const router = express.Router();
const controllers = require("../controllers/user");

router.post("/login", controllers.login);
router.post("/signup", controllers.signup);
router.post("/userOrPetEdit", controllers.userOrPetEdit);
router.get("/userInfo", controllers.userInfo);
router.get("/allFindPet", controllers.allFindPet);
router.post("/userDelete", controllers.userDelete);

module.exports = router;
