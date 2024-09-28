const { check } = require("express-validator");
const { formValidation } = require("../others");
const brandModel = require("../../../models/brand");

const validations = {
  BrandValidation: [
    check("name").trim().notEmpty().withMessage("Name is required"),
  //       .custom(async (value) => {
  //    let checkExist = await brandModel.findOne({name : value})
  //    if(checkExist) throw new Error("Brand name already exists")
  // }),


    check("slug")
      .trim()
      .notEmpty()
      .withMessage("Please enter slug")
      .isSlug()
      .withMessage("Slug is not valid"),

  

   


    formValidation,
  ],



  ModelValidation: [
    check("name").trim().notEmpty().withMessage("Name is required"),

    check("slug")
      .trim()
      .notEmpty()
      .withMessage("Please enter slug")
      .isSlug()
      .withMessage("Slug is not valid"),

  
      check("brandId").trim().notEmpty().withMessage("Brand Id is required"),

   


    formValidation,
  ],
};

module.exports = validations;
