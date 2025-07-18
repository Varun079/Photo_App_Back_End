const express = require("express");
const { userSignupController, userLoginController, sendOtpController, logoutController } = require("./controller");
const { signupValidator, loginValidator, otpValidator } = require("./dto");

const authRouter = express.Router();

// /api/v1/auth/...
authRouter.post("/signup", signupValidator, userSignupController);
authRouter.post("/login", loginValidator, userLoginController);
authRouter.post("/send-otp", otpValidator, sendOtpController);
authRouter.get("/logout", logoutController);

module.exports = { authRouter };
