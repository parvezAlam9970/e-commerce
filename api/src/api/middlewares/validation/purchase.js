const { check } = require("express-validator");
const { formValidation } = require("../others");

const validations = {
  purchaseValidation: [
    check("name").trim().notEmpty().withMessage("Name is required"),



    check("supplierId")
      .notEmpty()
      .withMessage("Please add at least one Supplier"),


      check("slug").notEmpty().withMessage("Please Enter Slug"),



    check("Costprice").notEmpty().withMessage("Please enter Cost"),

    check("quantity").notEmpty().withMessage("Please enter Quantity"),

    check("type")
      .notEmpty()
      .withMessage("Please enter type")
      .isIn(["Capsule", "Tablet", "Syrup", "Miscellaneous"])
      .withMessage(
        "Invalid type. Accepted values are Capsule, Tablet, Syrup, or Miscellaneous."
      ),


      check("ExpiryDate")
      .trim()
      .notEmpty()
      .withMessage("Provide a Expiry Date"),

      check("subHeading")
      .trim()
      .notEmpty()
      .withMessage("Provide a sub Heading"),



    formValidation,
  ],
};

module.exports = validations;
