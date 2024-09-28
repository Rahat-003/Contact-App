const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    res.send("Welcome to Evatix Assessment 2024");
});

module.exports = router;
