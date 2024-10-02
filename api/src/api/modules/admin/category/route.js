const { Router } = require("express");
const controller = require("./controller");
const validation = require('../../../middlewares/validation/category')

const router = Router({ mergeParams: true });


router.post('/save', validation.categoryValidation , controller.createCategory);


router.get('/list',  controller.list);
router.get('/list-all',  controller.listAllWithParentAndChild);

router.post('/delete',  controller.delete);




module.exports = router;