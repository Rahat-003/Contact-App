const UserModel = require("./../models/UserModel");
const { successResponse, errorResponse } = require("./../helpers/apiResponse");
const { getRefreshToken } = require("../helpers/getRefreshToken");
const validator = require("validator");

exports.userSignUp = async (req, res) => {
    try {
        let { name, email, password, dob, gender } = req.body;

        if (!name) return errorResponse(res, "name is required");
        if (!email) return errorResponse(res, "email is required");
        if (!password) return errorResponse(res, "password is required");
        if (!dob) return errorResponse(res, "dob is required");
        if (!gender) return errorResponse(res, "gender is required");

        email = email.toLowerCase();

        if (!validator.isEmail(email))
            return errorResponse(res, "Invalid email");

        const userExists = await UserModel.findOne({ email, deletedAt: null });

        if (userExists) return errorResponse(res, "User already exists");

        const newUser = await UserModel.create({
            name,
            email,
            password,
            dob,
            gender,
        });

        const token = getRefreshToken(newUser);

        return successResponse(res, {
            message: "User created successfully.",
            data: {
                token,
            },
        });
    } catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("-password");
        return successResponse(res, {
            message: "User profile fetched successfully.",
            data: {
                user,
            },
        });
    } catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
};
