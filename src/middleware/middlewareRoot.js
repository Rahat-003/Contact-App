const moment = require("moment");
exports.middlewareRoot = (req, res, next) => {
    console.log(
        moment().format("MMMM Do YYYY, hh:mm A"),
        "\nMethod -> ",
        req.method,
        " => ",
        "https://" + req.headers.host + req.url
    );
    console.log("body -> ", req.body);
    console.log("query -> ", req.query);
    console.log("params -> ", req.params);
    next();
};
