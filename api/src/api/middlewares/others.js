const { validationResult } = require('express-validator');

function formValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: errors.msg,
            // errors: errors.errors
            errors: errors.array({ onlyFirstError: true })
        });
    } else {
        next();
    }
}

module.exports = { formValidation };