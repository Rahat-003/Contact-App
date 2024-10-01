const express = require("express");
const router = express.Router();
const DummyController = require("./../controllers/DummyController");

/**
 * @url http://localhost:3000/
 */

router.get("/", async (req, res) => {
    res.send("Welcome to Contact Application");
});

// Inserting dummy data into DB
router.post("/insert-dummy-user", DummyController.insertDummyUser);
router.post("/insert-dummy-data/find-user", DummyController.findUser);
router.post("/insert-dummy-contact", DummyController.insertDummyContact);

router.use("/user", require("./user/index"));
router.use("/contacts", require("./../routes/contact/endpoint/contact.route"));

module.exports = router;
