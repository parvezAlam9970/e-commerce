const { Router } = require("express");
const controller = require("./controller");
const validation = require('../../../middlewares/validation/brand')

const router = Router({ mergeParams: true });


router.post('/save', validation.BrandValidation, controller.save);


router.get('/list',  controller.list);
router.post('/delete',  controller.delete);




module.exports = router;