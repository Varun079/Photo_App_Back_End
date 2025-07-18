const { handleGenericAPIError } = require("../../../utils/controllerHelpers");

const loginValidator = (req, res, next) => {
    console.log("--> loginValidator", req.body);
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                isSuccess: false,
                message: "Email and Password is required",
                data: {},
            });
            return;
        }
        next();
    } catch (err) {
        handleGenericAPIError("loginValidator", req, res, err);
    }
};

const signupValidator = (req, res, next) => {
    console.log("--> signupValidator", req.body);
    try {
        const { email, otp, password } = req.body;
        if (!email || !password || !otp) {
            res.status(400).json({
                isSuccess: false,
                message: "Email, Password and OTP is required",
                data: {},
            });
            return;
        }
        next();
    } catch (err) {
        handleGenericAPIError("loginValidator", req, res, err);
    }
};

const otpValidator = (req, res, next) => {
    console.log("--> otpValidator", req.body);
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({
                isSuccess: false,
                message: "Email is required",
                data: {},
            });
            return;
        }
        next();
    } catch (err) {
        handleGenericAPIError("loginValidator", req, res, err);
    }
};

module.exports = { signupValidator, loginValidator, otpValidator };
