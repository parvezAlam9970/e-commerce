const { Router } = require("express");
const controller = require("./controller");
const validation = require("../../../middlewares/validation/user");
const { validateToken, validateTokenFront } = require("../../../middlewares/authFront");

const router = Router({ mergeParams: true });


router.post('/send-otp', validation.userSendOtp,  controller.sendOtp);
router.post('/validate-otp',validation.frontValidateOtp ,  validation.userOtpSession,  controller.validateOtp);



router.get("/details", validateTokenFront, controller.userData);


router.post("/user-update", validateTokenFront, validation.updateUserFront,controller.userUpdate);





// router.use(validateToken);
// router.post("/accept-terms", controller.updateTermsAcceptance);
// router.get("/accept-terms", controller.getTermsAcceptance);
// router.get("/details", controller.userData);
// router.post("/update-user", validateToken, validation.updateUserFront, controller.userUpdate);
// router.get('/validate-token', controller.userData);

module.exports = router;