const { OtpModel } = require("../../../models/otpSchema");
const { UserModel } = require("../../../models/userSchema");
const bcrypt = require("bcrypt");
const { customAlphabet } = require("nanoid");
const { attachJWTToken, removeJWTToken } = require("../../../utils/jwtHelpers");
const { handleGenericAPIError } = require("../../../utils/controllerHelpers");
const { sendOtpMail } = require("../../../utils/emailHelpers");
const nanoid = customAlphabet("1234567890", 6);

const userSignupController = async (req, res) => {
    console.log("--> inside userSignupController");
    try {
        const { email, password, otp } = req.body;
        // check if user already exists
        const user = await UserModel.findOne({
            email: email,
        }).lean();

        if (user !== null) {
            res.status(400).json({ isSuccess: false, message: "User already exists! Please Login", data: {} });
            return;
        }

        const sentOtpDoc = await OtpModel.findOne({
            email: email,
        }).lean();

        if (sentOtpDoc == null) {
            res.status(400).json({ isSuccess: false, message: "Please resend the otp!", data: {} });
        }

        const { otp: hashedOtp } = sentOtpDoc;

        const isCorrect = bcrypt.compare(otp.toString(), hashedOtp);

        if (!isCorrect) {
            res.status(400).json({ isSuccess: false, message: "Incorrect otp! Please try again...", data: {} });
        }

        await UserModel.create({ email, password });

        res.status(201).json({
            isSuccess: true,
            message: "User created!",
            data: {},
        });
    } catch (err) {
        handleGenericAPIError("userSignupController", req, res, err);
    }
};

const sendOtpController = async (req, res) => {
    console.log("--> inside sendOtpController");
    try {
        const { email } = req.body;

        const otp = nanoid();

        await sendOtpMail(email, otp);

        await OtpModel.create({ email, otp });

        res.status(201).json({ isSuccess: true, message: "Otp sent!" });
    } catch (err) {
        handleGenericAPIError("sendOtpController", req, res, err);
    }
};

const userLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({
            email: email,
        }).lean();

        if (user === null) {
            res.status(400).json({
                isSuccess: false,
                message: "User does not exists! Please sign up first!",
                data: {},
            });
            return;
        }

        const { password: hashedPassword } = user;

        const isCorrect = bcrypt.compare(password.toString(), hashedPassword);

        if (!isCorrect) {
            res.status(400).json({ isSuccess: false, message: "Incorrect password! Please try again...", data: {} });
        }

        attachJWTToken(res, { email: user.email, _id: user._id });

        res.status(200);
        res.json({
            isSuccess: true,
            message: "Login successful!",
            data: {
                user: { email: user.email, _id: user._id },
            },
        });
    } catch (err) {
        handleGenericAPIError("userLoginController", req, res, err);
    }
};

const logoutController = async (req, res) => {
    console.log("--> inside logoutController");
    removeJWTToken(res, {});
    res.status(200).json({ isSuccess: true, message: "Logout success!" });
};

module.exports = {
    userSignupController,
    userLoginController,
    sendOtpController,
    logoutController,
};
