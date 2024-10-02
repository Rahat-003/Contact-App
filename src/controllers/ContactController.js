const ContactModel = require("./../models/ContactModel");
const { successResponse, errorResponse } = require("./../helpers/apiResponse");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

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

/*
 * Import phone number for the authenticated user from JSON file from public/data directory
 * Phone numbers which are already existing in DB for that user are skipped
 * Rest numbers are inserted to DB
 */
exports.importContact = async (req, res) => {
    try {
        const userId = req.userId;
        const inputFilePath = path.join(
            __dirname,
            `./../../public/data/${userId}-contacts.json`
        );

        const jsonData = fs.readFileSync(`${inputFilePath}`, "utf-8");
        const contactsArray = JSON.parse(jsonData);

        const contactList = contactsArray.flatMap((singleGroup) => {
            // Only 4 groups as per our model (family, friend, work, other)
            return singleGroup.contacts.map((contact) => {
                const singleContact = {};
                singleContact.user = ObjectId.createFromHexString(userId);
                if (contact?.name) singleContact.name = contact.name;
                if (contact?.phone) singleContact.phone = contact.phone;
                if (contact?.email) singleContact.email = contact.email;
                if (contact?.address) singleContact.address = contact.address;
                singleContact.group = singleGroup.group || "other"; // Group field comes from singleGroup
                return singleContact;
            });
        });

        const phoneNumbers = contactList.map((contact) => contact.phone);
        const existingContactsInDB = await ContactModel.find({
            user: ObjectId.createFromHexString(userId),
            phone: { $in: phoneNumbers },
            deletedAt: null,
        }).select("phone");

        // Took a set of existing phone numbers. From this set, searches will be made for each contact.
        const existingPhonesSet = new Set(
            existingContactsInDB.map((contact) => contact.phone)
        );

        const existingContacts = [];
        const newContacts = [];

        contactList.forEach((contact) => {
            if (existingPhonesSet.has(contact.phone)) {
                existingContacts.push(contact); // Already in DB
            } else {
                newContacts.push(contact); // New contact to insert
            }
        });

        if (newContacts.length > 0) {
            await ContactModel.insertMany(newContacts);
        }

        await ContactModel.insertMany(contactList);

        return successResponse(res, {
            message: "Successfully imported contact",
            data: {
                existingContacts,
                insertedContacts: newContacts,
            },
        });
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

// Tested with 5M+ Contacts, exported to JSON at ~200ms
exports.exportContact = async (req, res) => {
    try {
        const userId = req.userId;

        const result = await ContactModel.aggregate([
            {
                $match: {
                    user: ObjectId.createFromHexString(userId),
                    deletedAt: null, // exclude contacts which were deleted
                },
            },
            {
                $group: {
                    _id: "$group", // group by 'group' field
                    contacts: { $push: "$$ROOT" }, // push all contacts to their corresponding group
                },
            },
            {
                $addFields: {
                    user: ObjectId.createFromHexString(userId),
                },
            },
            {
                $project: {
                    _id: 0, // removed group, where _id:family
                    group: "$_id", // Rename _id to group
                    user: 1, // keep the userId field
                    contacts: {
                        $map: {
                            input: "$contacts", // map over the contacts array
                            as: "contact",
                            in: {
                                name: "$$contact.name",
                                phone: "$$contact.phone",
                                email: "$$contact.email",
                                address: "$$contact.address",
                            },
                        },
                    },
                },
            },
        ]);

        const jsonString = JSON.stringify(result, null, 2);

        const outputFilePath = path.join(
            __dirname,
            `./../../public/backup/${userId}-contacts.json`
        );

        fs.writeFileSync(`${outputFilePath}`, jsonString, (err) => {
            if (err) {
                console.error("Error writing file:", err);
            }
        });

        return successResponse(res, {
            meessage: "Successfully exported contact",
        });
    } catch (err) {
        console.log(err);
        return errorResponse(res, err.message);
    }
};
