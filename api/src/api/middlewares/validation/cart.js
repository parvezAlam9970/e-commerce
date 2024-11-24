const { check } = require("express-validator");
const { formValidation } = require("../others");
const productVarientModel = require("../../../models/productVarient");
const Response = require("../../../utilities/Response");
const HttpStatus = require('http-status-codes');


const validations = {
  cartSaveValidation: [
 

    check("productId")
      .notEmpty()
      .withMessage("Please enter Product ID"),

      check("productVarientId")
      .notEmpty()
      .withMessage("Please enter Product Varient ID"),

      
    check("quantity")
    .notEmpty()
    .withMessage("Please enter Quantity"),

   


    formValidation,
  ],



  inventoryValidation: async (req, res, next) => {
    try {
        const productVariant = await productVarientModel.findOne({ _id: req.body.productVarientId, isDeleted: false, status: true });

        if (!productVariant) {
            return Response.fail(res, 'Product not found!!', HttpStatus.StatusCodes.NOT_FOUND);
        }

        const maxQty = productVariant.inventory;

        if (maxQty <= 0) {
            return Response.fail(res, 'Currently this product is out of stock', HttpStatus.StatusCodes.BAD_REQUEST);
        }

        if (maxQty < (req.body.quantity ? req.body.quantity : 1)) {
            return Response.fail(res, 'Currently max quantity for this product is ' + (maxQty > 100 ? 100 : maxQty), HttpStatus.StatusCodes.NOT_ACCEPTABLE);
        }

        req.body.productId = productVariant.productId;
        next();

    } catch (e) {
        Response.fail(res, 'Internal server error', HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


};

module.exports = validations;
