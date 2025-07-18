const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Image = require("../../../models/models.js"); // Fixed model import path
const { geminiAi } = require("../../../config/aiConfig.js");
const { userAuthenticationMiddleware } = require("../middleware");

const uploadsDir = path.join(__dirname, "../../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ),
});
const upload = multer({ storage });

const imagerouter = express.Router();

// GET /api/v1/image/ - get all images (metadata) for the logged-in user
imagerouter.get("/", userAuthenticationMiddleware, async (req, res) => {
  try {
    const data = await Image.find({ user: req.user._id });
    const items = data.map((image) => ({
      _id: image._id,
      name: image.name,
      desc: image.desc,
      img: {
        contentType: image.img.contentType,
        data: image.img.data.toString("base64"),
      },
    }));
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: "Fetching images failed." });
  }
});

// POST /api/v1/image/ - upload image (associate with user)
imagerouter.post("/", userAuthenticationMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const imageBuffer = fs.readFileSync(
      path.join(uploadsDir, req.file.filename)
    );

    const imageBase64 = imageBuffer.toString("base64");

    const response = await geminiAi.models.generateContent({
      model: "gemini-2.0-flash",
      contents:  [
    {
      role: "user",
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
        { text: "Please provide a description for this image. Keep it short and include main and major points only." }
      ]
    }
  ],
      generationConfig: {
        maxOutputTokens: 60, // Optional: limits the response size
      },
    });
    const description =
      response.text ||
      (response.candidates &&
        response.candidates[0].content.parts.find((p) => p.text).text) ||
      "No description available";

    const obj = {
      name: req.body.name,
      desc: description,
      img: {
        data: imageBuffer,
        contentType: req.file.mimetype,
      },
      user: req.user._id, // associate with user
    };
    const item = await Image.create(obj);
    res.status(201).json({ message: "Image uploaded", id: item._id });
  } catch (err) {
    console.log("========================");
    console.log("========================");
    console.log(err);
    res.status(500).json({ error: "Image upload failed." });
  }
});

// GET /api/v1/image/:id/raw - serve image as file
imagerouter.get("/:id/raw", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).send("Not found");
    res.set("Content-Type", image.img.contentType);
    res.send(image.img.data);
  } catch (err) {
    res.status(500).send("Error retrieving image");
  }
});

// DELETE /api/v1/image/:id - delete image by ID
imagerouter.delete('/:id', async (req, res) => {
  try {
    const deleted = await Image.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Image not found' });
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = { imagerouter };
