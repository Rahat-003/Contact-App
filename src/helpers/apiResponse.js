exports.successResponse = async (res, { message, data = null }) => {
    const object = {
        status: true,
        message,
    };
    if (data) {
        object.data = data;
    }
    return res.status(200).json(object);
};

exports.errorResponse = (res, msg) => {
    res.status(400).json({
        status: false,
        message: msg,
    });
};

exports.errorResponseWithCode = (res, msg, code) => {
    res.status(code || 400).json({
        status: false,
        message: msg,
    });
};
