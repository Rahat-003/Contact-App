const jwt = require("jsonwebtoken");

exports.getRefreshToken = (user) => {
    try {
        const jwtData = {
            userId: user._id,
            name: user.name,
        };
        const expiresIn = {
            expiresIn: process.env.JWT_TIMEOUT_DURATION,
        };
        const token = jwt.sign(
            jwtData,
            process.env.JWT_PRIVATE_KEY_USER,
            expiresIn
        );
        return token;
    } catch (err) {
        console.log(err);
    }
};
