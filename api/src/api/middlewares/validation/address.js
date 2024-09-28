const { check } = require('express-validator');
const { formValidation } = require('../others');

const validations = {

    userAddress: [
        // check("type")
        //     .trim()
        //     .notEmpty().withMessage("Please choose delivery address type")
        //     .isIn(['Home', 'Office', 'Other']).withMessage("Address type should be from 'Home','Office' and 'Other'")
        //     .notEmpty().withMessage("Please choose delivery address type"),

        check("name")
            .trim()
            .notEmpty().withMessage("Please fill receiver name"),

        check("phone")
            .trim()
            .notEmpty().withMessage("Please fill phone number")
            .isLength({ min: 10, max: 10 }).withMessage("Phone number should be of length 10"),

 
        check("state")
            .trim()
            .notEmpty().withMessage("Please fill State name"),

            check("city")
            .trim()
            .notEmpty().withMessage("Please fill city name"),

        check("pinCode")
            .trim()
            .notEmpty().withMessage("Please fill pin code")
            .isLength({ min: 6, max: 6 }).withMessage("Please enter valid pin code"),

        check("address_line_1")
            .trim()
            .notEmpty().withMessage("Please fill address line 1"),



        formValidation
    ],

}

module.exports = validations;