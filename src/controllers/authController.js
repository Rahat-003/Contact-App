const UserModel = require("./../models/UserModel");
const { successResponse, errorResponse } = require("./../helpers/apiResponse");

const bcrypt = require("bcrypt");
const { getRefreshToken } = require("../helpers/getRefreshToken");

exports.userLogin = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password)
            return errorResponse(res, "email and password is required");
        email = email.toLowerCase();

        const user = await UserModel.findOne({ email }).select(
            "email password"
        );

        if (!user) return errorResponse(res, "User not found");

        const matchPassword = bcrypt.compareSync(password, user.password);

        if (!matchPassword) {
            return errorResponse(res, "Wrong password.");
        }
        const token = getRefreshToken(user);

        successResponse(res, {
            message: "Login Success.",
            data: {
                token,
            },
        });
    } catch (error) {
        return errorResponse(res, error.message);
    }
};
