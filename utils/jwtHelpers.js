const jwt = require("jsonwebtoken");

const attachJWTToken = (res, data) => {
    const token = jwt.sign(data, process.env.JWT_SECRET);

    res.cookie("authorization", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: true, // only sent over https connections
        sameSite: "None", // only our backend will get this cookie (no other backend can access it)
        httpOnly: true, // frontend will not be able to read this cookie
        // so that our token is out of reach of javascript --> hackers
    });
};

const removeJWTToken = (res) => {
    res.cookie("authorization", "", {
        maxAge: 0,
        secure: true, // only sent over https connections
        sameSite: "None", // only our backend will get this cookie (no other backend can access it)
        httpOnly: true, // frontend will not be able to read this cookie
        // so that our token is out of reach of javascript --> hackers
    });
};

module.exports = { attachJWTToken, removeJWTToken };
