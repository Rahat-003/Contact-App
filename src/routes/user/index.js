const express = require("express");
const router = express.Router();
const { checkUserToken } = require("./../../authentication/checkUserToken");
const UserController = require("./../../controllers/UserController");
const ContactController = require("./../../controllers/ContactController");
/**
 *
 * @url http://localhost:3000/user
 *
 */
router.use("/auth", require("./endpoint/auth.user.route"));
router.use("/profile", checkUserToken, UserController.getUserProfile);
router.use("/import-contact", checkUserToken, ContactController.importContact);
router.use("/export-contact", checkUserToken, ContactController.exportContact);

module.exports = router;
