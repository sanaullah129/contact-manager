const {constants} = require('../constants');

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({title: "Validation Failed",message: err.message, stackTrace: error.stack});
            break;
        case constants.NOT_FOUND:
            res.json({title: "Not Found",message: err.message, stackTrace: error.stack});
        case constants.UNAUTHORIZED:
            res.json({title: "Not authorized",message: err.message, stackTrace: error.stack});
        case constants.FORBIDDEN:
            res.json({title: "Forbidden",message: err.message, stackTrace: error.stack});
        case constants.SERVER_ERROR:
            res.json({title: "Server not found",message: err.message, stackTrace: error.stack});
        default:
            console.log("No Error");
            break;
    }

    
};
module.exports = errorHandler;