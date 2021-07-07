const express = require("express");
const router = express.Router();
const controllers = require("../controllers/user");
const auth = require("../controllers/login");

router.post("/signup", controllers.signup);
router.post("/userOrPetEdit", controllers.userOrPetEdit);
router.get("/userInfo", controllers.userInfo);
router.get("/allFindPet", controllers.allFindPet);
router.post("/userDelete", controllers.userDelete);
router.get("/logout", controllers.logout);
router.post("/login", auth.create);

module.exports = router;
