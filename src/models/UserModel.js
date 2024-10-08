const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = Number(process.env.SALT_WORK_FACTOR);

const UserSchema = new Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        // date of birth
        dob: {
            type: Date,
        },
        gender: {
            type: String,
            enum: {
                values: ["male", "female", "other"],
            },
        },
        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", function (next) {
    let user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model("users", UserSchema);
