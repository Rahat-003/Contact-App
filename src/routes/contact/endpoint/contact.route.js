const express = require("express");
const router = express.Router();
const { checkUserToken } = require("./../../../authentication/checkUserToken");
const ContactController = require("./../../../controllers/ContactController");
/**
 *
 * @url http://localhost:3000/contacts
 *
 */

router.get("/", checkUserToken, ContactController.getContactList);
router.post("/", checkUserToken, ContactController.createNewContact);
router.put("/:id", ContactController.updateContact);
router.delete("/:id", ContactController.deleteContact);
router.get("/group", checkUserToken, ContactController.getContactListByGroup);

module.exports = router;
