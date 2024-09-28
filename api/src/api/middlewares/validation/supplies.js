const { check } = require("express-validator");
const { formValidation } = require("../others");

const validations = {
    SuppliesValidation: [
        check("supplierId")
        .notEmpty()
        .withMessage("Please add at least one Supplier"),

        check("medicineId")
        .notEmpty()
        .withMessage("Please add at least one medicine"),


        check("supply_date")
        .notEmpty()
        .withMessage("Supply date required"),

        check("purchasePricePerQuantity")
        .notEmpty()
        .withMessage("Purchase Price Per Quantity is required"),

        check("quantity")
        .notEmpty()
        .withMessage("quantity is required"),




        formValidation,
    ]
};

module.exports = validations;
