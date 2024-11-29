const { Router } = require("express");
const controller = require("./controller");

const router = Router({ mergeParams: true });



router.post("/create-session-booking",  controller.createSessionBooking);






module.exports = router;