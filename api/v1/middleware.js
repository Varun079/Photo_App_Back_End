const { handleGenericAPIError } = require("../../utils/controllerHelpers");
const jwt = require("jsonwebtoken");

const userAuthenticationMiddleware = (req, res, next) => {
    console.log("--> inside userAuthenticationMiddleware");
    try {
        const { authorization } = req.cookies;
        // console.log("--> authorization", authorization);
        if (!authorization) {
            res.status(401).json({ isSuccess: false, message: "Token not found!" });
        }
        jwt.verify(authorization, process.env.JWT_SECRET, function (err, decodedData) {
            if (err) {
                res.status(401).json({
                    isSuccess: false,
                    message: "Invalid token!",
                    data: {},
                });
            } else {
                req.user = decodedData;
                next();
            }
        });
    } catch (err) {
        handleGenericAPIError("userAuthenticationMiddleware", req, res, err);
    }
};

module.exports = { userAuthenticationMiddleware };
