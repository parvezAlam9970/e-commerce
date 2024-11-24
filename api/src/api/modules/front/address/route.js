const { Router } = require("express");
const controller = require("./controller");
const {userAddress} = require("../../../middlewares/validation/address");

const router = Router({ mergeParams: true });

router.get("/list", controller.listAddress);
router.post("/save",userAddress, controller.saveAddress);
router.post("/delete",  controller.deleteAddress);

module.exports = router;