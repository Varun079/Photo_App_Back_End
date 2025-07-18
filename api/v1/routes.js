const express = require("express");
const { authRouter } = require("./auth/routes");
const { usersRouter } = require("./users/routes");
const { userAuthenticationMiddleware } = require("./middleware");
const { imagerouter } = require("./image/routes");
const cors = require('cors');

const apiRouter = express.Router();

apiRouter.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

apiRouter.use("/auth", authRouter);

apiRouter.use("/image", imagerouter); // public image upload/fetch

apiRouter.use(userAuthenticationMiddleware); // authentication

// all the routes below this middleware are now (protected APIs)

apiRouter.use("/users", usersRouter);

module.exports = { apiRouter };
