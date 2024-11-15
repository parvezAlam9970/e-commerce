const { Router } = require("express");
const controller = require("./controller");

const router = Router({ mergeParams: true });




router.get('/list',  controller.list);
// router.get('/list-all',  controller.listAllWithParentAndChild);





module.exports = router;