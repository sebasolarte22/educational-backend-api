const asyncHandler = require("../middlewares/asyncHandler");
const authService = require("../services/auth.service");

//
// REGISTER
//
exports.register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json(user);
});

//
// LOGIN
//
exports.login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = await authService.login(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax"
  });

  res.json({ token: accessToken }); // ⭐ FIX
});

//
// REFRESH
//
exports.refresh = asyncHandler(async (req, res) => {
  const old = req.cookies.refreshToken;

  const { accessToken, refreshToken } = await authService.refresh(old);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax"
  });

  res.json({ token: accessToken }); // ⭐ FIX
});

//
// LOGOUT
//
exports.logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  await authService.logout(token);

  res.clearCookie("refreshToken");

  res.json({ message: "logout ok" });
});