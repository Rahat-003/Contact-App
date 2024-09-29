const express = require("express");
const router = express.Router();
/**
 * @url http://localhost:3000/
 */

router.get("/", async (req, res) => {
    res.send("Welcome to Evatix Assessment 2024");
});

// router.post("/sign-up", UserController.createUser);
router.use("/user", require("./user/index"));

module.exports = router;
