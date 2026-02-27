const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");
const favoriteService = require("../services/fav.service");

// ==========================
// GET MY FAVORITES
// ==========================
const getMyFavorites = asyncHandler(async (req, res) => {
  const favorites = await favoriteService.getMyFavorites(req.user.id);

  res.json(favorites);
});

// ==========================
// ADD FAVORITE
// ==========================
const addFavorite = asyncHandler(async (req, res) => {
  const courseId = req.params.id;

  const favorite = await favoriteService.addFavorite({
    userId: req.user.id,
    courseId
  });

  res.status(201).json(favorite);
});

// ==========================
// REMOVE FAVORITE
// ==========================
const removeFavorite = asyncHandler(async (req, res) => {
  const courseId = req.params.id;

  await favoriteService.removeFavorite({
    userId: req.user.id,
    courseId
  });

  res.json({ success: true });
});

module.exports = {
  getMyFavorites,
  addFavorite,
  removeFavorite
};