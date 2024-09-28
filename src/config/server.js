const express = require("express");
require("dotenv").config();
const { middlewareRoot } = require("./../middleware/middlewareRoot");

const app = express();

const server = require("http").createServer(app);

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(middlewareRoot);

app.use("/", require("./../routes/api"));

// 404 page
app.use((req, res, next) => {
    res.status(404).json({
        status: false,
        error: "404 Page not found",
    });
});

// Error handler middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        status: false,
        error: "Internal Server Error",
    });
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
module.exports = server;
