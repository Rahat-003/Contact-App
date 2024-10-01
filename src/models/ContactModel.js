const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { String, ObjectId, Number, Date } = Schema.Types;

const contactModel = new Schema(
    {
        user: {
            type: ObjectId,
            ref: "users",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        address: {
            type: String,
        },
        group: {
            type: String,
            enum: {
                values: ["family", "friend", "work", "other"],
                message: "{VALUE} is not supported",
            },
            required: true,
        },
        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

contactModel.index({ user: 1 });

module.exports = mongoose.model("contacts", contactModel);
