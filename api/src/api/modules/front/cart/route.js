const { Router } = require("express");
const controller = require("./controller");

const router = Router({ mergeParams: true });
const validations =  require("../../../middlewares/validation/cart")




router.post('/save',  validations.cartSaveValidation , validations.inventoryValidation ,  controller.save);
router.get('/list',  controller.list);
router.get('/calculate-price',  controller.calculatePrice);






module.exports = router;