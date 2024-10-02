const mongoose = require("mongoose");
/**
 * MongoDB Connection
 */

mongoose.set("strictQuery", true);

mongoose
    .connect(process.env.MONGODB_URL, {})
    .then(() => {
        console.log(
            "Mongodb Connected to %s",
            process.env.MONGODB_URL.substring(
                process.env.MONGODB_URL.lastIndexOf("/") + 1
            )
        );
    })
    .catch((err) => {
        console.error("App starting error:", err.message);
        // process.Exit(1);
    });
