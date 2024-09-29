const express = require("express");
const authController = require("../../../controllers/authController");
const UserController = require("../../../controllers/UserController");
const router = express.Router();
/**
 * /app/user/auth
 * @url http://localhost:3000/user/auth
 *
 */

router.post("/sign-up", UserController.userSignUp);
router.post("/login", authController.userLogin);

module.exports = router;
