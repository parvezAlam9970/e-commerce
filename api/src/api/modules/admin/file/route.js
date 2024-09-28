const { Router } = require("express");
const controller = require("./controller");
// const validation = require('../../../middlewares/validation/file');
// const { formValidation } = require('../../../middlewares/others');

// const { uploadToS3Bucket, deleteFromS3Bucket, uploadToAWS, deleteFromAWS } = require('../../../middlewares/uploadToAWS');
const { upload } = require("../../../../loaders/multer");
const {
  handleUploadToCloudinary,
} = require("../../../middlewares/uploadToCloudnary");

const router = Router({ mergeParams: true });

router.post("/save", upload.single("file"), handleUploadToCloudinary,controller.save );
// router.post('/save-base64', validation.fileBase64, formValidation, uploadFileBase64, controller.save);
router.post('/remove', controller.remove);

module.exports = router;
