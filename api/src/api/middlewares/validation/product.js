const { check, body } = require("express-validator");
const { formValidation } = require("../others");

const validations = {
  productValidation: [
    check("name").trim().notEmpty().withMessage("Please provide product name"),

    check("slug").trim().notEmpty().withMessage("Please provide product slug"),

    check("productCode").trim().notEmpty().withMessage("Please provide product code"),

    // check("isAccessory")
    //   .isBoolean()
    //   .withMessage("Please specify if the product is an accessory"),

    // check("hasVariants")
    //   .isBoolean()
    //   .withMessage("Please specify if the product has variants"),

    // body("hasVariants").custom((value, { req }) => {
    //   if (value) {
    //     return true;
    //   }

    //   if (!req.body.price || req.body.price.trim() === "") {
    //     throw new Error("Price is required for products without variants");
    //   }
    //   if (!req.body.stock || isNaN(req.body.stock)) {
    //     throw new Error(
    //       "Stock is required and should be a valid number for products without variants"
    //     );
    //   }
    //   return true;
    // }),



    check("categoryIds")
      .trim()
      .notEmpty()
      .withMessage("Please provide a valid category ID"),

    check("modelId").trim().notEmpty().withMessage("Please provide a model ID"),

  
    // check("price")
    // .notEmpty()
    // .withMessage("Please provide Price for the product"),

    // check("stock")
    // .notEmpty()
    // .withMessage("Please provide Stock for the product"),

    check("description")
      .trim()
      .notEmpty()
      .withMessage("Please provide a description for the product"),

    formValidation,
  ],
};

module.exports = validations;
