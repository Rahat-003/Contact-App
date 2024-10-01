const UserModel = require("./../models/UserModel");
const ContactModel = require("./../models/ContactModel");
const { successResponse, errorResponse } = require("./../helpers/apiResponse");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = Number(process.env.SALT_WORK_FACTOR);

exports.insertDummyUser = async (req, res) => {
    try {
        const maxLength = 502;

        let getLen = (await UserModel.countDocuments()) || 0;
        const userPromises = [];
        for (let i = 1; i <= maxLength; i++) {
            const user = {
                name: `dummy${i + getLen}`,
                email: `dummy${i + getLen}@gmail.com`,
                password: `12345`,
                dob: new Date(),
                gender: "male",
            };
            userPromises.push(UserModel.create(user));
        }
        await Promise.all(userPromises);

        return successResponse(res, {
            message: `${maxLength} dummy users inserted successfully.`,
        });
    } catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
};

exports.findUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.find({
            email,
            deletedAt: null,
        }).select("-password");

        return successResponse(res, {
            message: "User found successfully.",
            data: {
                user,
            },
        });
    } catch (err) {
        console.log(err);
    }
};

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.insertDummyContact = async (req, res) => {
    try {
        const groupList = ["family", "friend", "work", "other"];
        const contactList = [];
        const userIdList = [];
        const userLen = await UserModel.countDocuments();
        if (userLen === 0)
            return errorResponse(res, {
                message: "Insert some users first",
            });

        for (let i = 0; i < userLen; i++) {
            const user = await UserModel.findOne({
                email: `dummy${i + 1}@gmail.com`,
            });
            if (!user) {
                continue;
            }
            userIdList.push(user._id.toString());
        }
        const maxLength = 300005;

        for (let i = 0; i < maxLength; i++) {
            const randomIndex = getRandomInt(0, userIdList.length - 1);
            const singleContact = {
                user: userIdList[randomIndex],
                name: `DummyContact${i + 1}`,
                phone: `01${getRandomInt(724618590, 996318953)}`,
                email: `lorem${i + 1}@gmail.com`,
                group: `${groupList[getRandomInt(0, 3)]}`,
            };
            contactList.push(singleContact);
        }
        await ContactModel.insertMany(contactList);
        return successResponse(res, {
            message: `${maxLength} Contact inserted successfully`,
        });
    } catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
};
