const asyncHandler = require("../middlewares/asyncHandler");
const authService = require("../services/auth.service");

// ==========================
// REGISTER
// ==========================
exports.register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json(user);
});

// ==========================
// LOGIN
// ==========================
exports.login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = await authService.login(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ token: accessToken });
});

// ==========================
// REFRESH
// ==========================
exports.refresh = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = await authService.refresh({
    refreshToken: req.cookies?.refreshToken
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ token: accessToken });
});

// ==========================
// LOGOUT
// ==========================
exports.logout = asyncHandler(async (req, res) => {
  await authService.logout({
    refreshToken: req.cookies?.refreshToken
  });

  res.clearCookie("refreshToken");
  res.json({ message: "Sesión cerrada" });
});