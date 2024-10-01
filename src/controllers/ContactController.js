const ContactModel = require("./../models/ContactModel");
const { successResponse, errorResponse } = require("./../helpers/apiResponse");

exports.getContactList = async (req, res) => {
    try {
        const userId = req.userId;
        const { page, limit } = req.query;
        const contact = await ContactModel.find({
            user: userId,
            deletedAt: null,
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({
                createdAt: -1,
            });

        const responseData = {
            message: `Contact list fetched successfully for page ${page}, having ${limit} contacts.`,
            data: {
                contact,
            },
        };
        return successResponse(res, responseData);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

exports.getContactListByGroup = async (req, res) => {
    try {
        const userId = req.userId;
        const { page, limit, group } = req.query;

        const contact = await ContactModel.find({
            user: userId,
            group,
            deletedAt: null,
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({
                createdAt: -1,
            });

        return successResponse(res, {
            message: `Contact list fetched successfully for page ${page}, having ${limit} contacts.`,
            data: {
                contact,
            },
        });
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

exports.createNewContact = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, email, address, group } = req.body;
        if (!name) return errorResponse(res, "name is required");
        if (!phone) return errorResponse(res, "phone is required");
        if (!group) return errorResponse(res, "group is required");

        const contactExists = await ContactModel.find({
            user: userId,
            phone,
            deletedAt: null,
        });

        if (contactExists.length > 0)
            return errorResponse(res, "Contact already exists");

        const newContact = await ContactModel.create({
            user: userId,
            name,
            phone,
            email,
            address,
            group,
        });

        return successResponse(res, {
            message: "Contact created successfully.",
            data: {
                contact: newContact,
            },
        });
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

// Update contact information using phone number
exports.updateContact = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, phone, updatedPhone, email, address, group } = req.body;

        if (!phone)
            return errorResponse(res, {
                message: "phone is required",
            });

        if (group && !["family", "friend", "work", "other"].includes(group)) {
            return errorResponse(res, {
                message: "Invalid group",
            });
        }

        const existingContact = await ContactModel.findOne({
            user: userId,
            phone: updatedPhone,
            deletedAt: null,
        });

        if (existingContact)
            return errorResponse(res, "Contact already exists");

        const updateFields = {};

        if (name) updateFields.name = name;
        if (phone) updateFields.phone = updatedPhone;
        if (email) updateFields.email = email;
        if (address) updateFields.address = address;
        if (group) updateFields.group = group;

        const updatedContact = await ContactModel.findOneAndUpdate(
            {
                user: userId,
                phone,
                deletedAt: null,
            },
            {
                $set: updateFields, // set the updatedFields to the matched data.
            },
            {
                new: true, // Return the updated document
            }
        );

        if (!updatedContact) {
            return errorResponse(res, "Contact not found");
        } else {
            return successResponse(res, {
                message: "Contact updated successfully.",
                data: {
                    contact: updatedContact,
                },
            });
        }
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

exports.deleteContact = async (req, res) => {
    try {
        const userId = req.params.id;
        const { phone } = req.query;

        const deltedContact = await ContactModel.findOneAndUpdate(
            {
                user: userId,
                phone,
                deletedAt: null,
            },
            {
                deletedAt: new Date(),
            },
            {
                new: true,
            }
        );

        if (!deltedContact) return errorResponse(res, "Contact not found");

        return successResponse(res, {
            message: "Contact deleted successfully.",
        });
    } catch (err) {
        return errorResponse(res, err.message);
    }
};
