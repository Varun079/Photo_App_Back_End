const dotEnv = require("dotenv");
dotEnv.config();
require("./config/db");
require("./utils/emailHelpers");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { apiRouter } = require("./api/v1/routes");

const app = express();

app.use(morgan("dev")); // global middleware

// --- CORS middleware for cross-origin cookies ---
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://photo-app-front-end-92lk.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", apiRouter);

// Test route to set a cookie for debugging
app.get('/test-cookie', (req, res) => {
  res.cookie('testcookie', 'testvalue', {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: 'None',
    httpOnly: true,
  });
  res.json({ message: 'Test cookie set' });
});

app.listen(process.env.PORT, () => {
    console.log("-------- Server started --------");
});
