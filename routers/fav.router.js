const express = require("express");
const router = express.Router();

const controller = require("../controllers/fav.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/", auth, controller.getMyFavorites);
router.post("/:id", auth, controller.addFavorite);
router.delete("/:id", auth, controller.removeFavorite);

module.exports = router;