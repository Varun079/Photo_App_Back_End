const express = require("express");
const {
    sendUserBasicInfoController,
    sendUserDetailsController,
    updateDisplayPictureController,
} = require("./controllers");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const usersRouter = express.Router();

usersRouter.get("/", sendUserBasicInfoController);

// /api/v1/users/details
usersRouter.get("/details", sendUserDetailsController);

// /api/v1/users/display-picture
// ... middleware chaining
usersRouter.put("/display-picture", upload.single("displayPicture"), updateDisplayPictureController);

module.exports = { usersRouter };
