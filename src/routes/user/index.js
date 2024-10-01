const express = require("express");
const router = express.Router();
const { checkUserToken } = require("./../../authentication/checkUserToken");
const UserController = require("./../../controllers/UserController");
/**
 *
 * @url http://localhost:3000/user
 *
 */
router.use("/auth", require("./endpoint/auth.user.route"));
router.use("/profile", checkUserToken, UserController.getUserProfile);

module.exports = router;
