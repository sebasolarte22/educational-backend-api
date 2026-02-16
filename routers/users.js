const express = require("express");
const router = express.Router();

const asyncHandler = require("../middlewares/asyncHandler");
const { createUser } = require("../controllers/user.controller");

router.post("/", asyncHandler(createUser));

module.exports = router;
