const { verify } = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const { errorHandler } = require("../helpers/apiResponse");

exports.checkUserToken = async (req, res, next) => {
    try {
        let token = req.get("authorization");

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Access denied! unauthorized User",
            });
        }

        // Removes the first 7 characters "Bearer " to get actual token
        token = token.slice(7);

        const { userId } = verify(token, process.env.JWT_PRIVATE_KEY_USER);

        if (!userId) {
            return res.status(403).json({
                status: false,
                message: "Invalid token 0",
            });
        }

        const user = await UserModel.findOne({
            _id: userId,
            deletedAt: null,
        });

        if (!user) {
            return res.status(403).json({
                status: false,
                error: "Invalid token 1",
            });
        }

        req.userId = userId;

        next();
    } catch (err) {
        console.log(err);
        return res.status(403).json({
            status: false,
            error: err,
        });
    }
};
