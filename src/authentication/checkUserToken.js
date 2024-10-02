const { verify } = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const { errorResponseWithCode } = require("../helpers/apiResponse");

exports.checkUserToken = async (req, res, next) => {
    try {
        let token = req.get("authorization");

        if (!token) {
            return errorResponseWithCode(
                res,
                "Access denied! unauthorized User",
                401
            );
        }

        // Removes the first 7 characters "Bearer " to get actual token
        token = token.slice(7);

        const { userId } = verify(token, process.env.JWT_PRIVATE_KEY_USER);

        if (!userId) {
            return errorResponseWithCode(res, "Invalid token 0", 403);
        }

        const user = await UserModel.findOne({
            _id: userId,
            deletedAt: null,
        });

        if (!user) {
            return errorResponseWithCode(res, "Invalid token 1", 403);
        }

        req.userId = userId;
        next();
    } catch (err) {
        return errorResponseWithCode(res, err, 403);
    }
};
