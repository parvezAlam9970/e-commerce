const { check, oneOf, body } = require("express-validator");
const { formValidation } = require("../others");
// const { clearSearch, decryptData } = require("../../../utilities/Helper");
// const Response = require("../../../utilities/Response");
// const Message = require("../../../utilities/Message");
// const config = require('../../../config');
// const { Types } = require("mongoose");
const userModel = require("../../../models/user");
const otpModel = require("../../../models/otp");
const { decryptData, clearSearch } = require("../../../utilities/Helper");
const Message = require("../../../utilities/Message");
const { Types } = require("mongoose");
// const userService = require('../../../services/user');

const validations = {
  userLoginValidation: [
    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Enter a vaild email")
      .custom((value) => {
        return userModel
          .findOne({ email: value, isDeleted: false })
          .then((data) => {
            if (data) {
            } else {
              throw new Error("Account does not exist for this user");
            }
          });
      }),
    check("password").notEmpty().withMessage("Please enter password"),

    formValidation,
  ],

  userSendOtp: [
    check("mobile_no")
      .notEmpty()
      .withMessage("Phone number is required")
      .isNumeric()
      .withMessage("Phone number should be of type numeric"),
  ],

  userOtpSession: [
    check("key")
      .notEmpty()
      .withMessage("Error! Missing something.")
      .custom(async (value, { req }) => {
        console.log(value)
        const decryptedKey = decryptData(value);
        const docData = await otpModel.findById(decryptedKey);

        if (!docData) {
          throw new Error("Invalid OTP session.");
        }

        const currentTime = Date.now();
        const otpExpireTime = new Date(docData.otp.expireTime).getTime();

        if (currentTime > otpExpireTime) {
          throw new Error("Otp session expired");
        }

        req.body.userId = docData.userId;
      }),





      check("otp")
      .notEmpty()
      .withMessage("Please provide your OTP.")
      .custom(async (value, { req }) => {
        const decryptedKey = decryptData(req.body.key);
        const docData = await otpModel.findById(decryptedKey);

        if (docData.otp.value !== value) { 
          throw new Error("Invalid OTP.");
        }
      }),


    formValidation,
  ],

  frontValidateOtp: [
    check("key").notEmpty().withMessage("Error! Missing something."),

    check("otp").notEmpty().withMessage("Provide your OTP"),

    formValidation,
  ],

  // userFromAdmin: [
  //     check('name')
  //         .trim()
  //         .notEmpty().withMessage("Please enter Name"),

  //     check("phone")
  //         .trim()
  //         .notEmpty().withMessage("Phone number is required")
  //         .isNumeric().withMessage("Phone number should be of type numeric")
  //         .isLength({ min: 10, max: 10 }).withMessage("Phone number should be of length 10")
  //         .custom(async (value, { req }) => {
  //             const { data } = await userService.listUser({ phone: value });
  //             if (data && Array.isArray(data) && data?.length) {
  //                 if (data.length > 1 || data.find(v => v._id.toString() != req.body._id)) {
  //                     throw new Error("A user already exits with this phone number");
  //                 }
  //             }
  //         }),

  //     check('email')
  //         .trim()
  //         .notEmpty().withMessage("Please enter email")
  //         .isEmail().withMessage("Please enter valid email")
  //         .custom(async (value, { req }) => {
  //             const { data } = await userService.listUser({ email: value });
  //             if (data && Array.isArray(data) && data?.length) {
  //                 if (data.length > 1 || data.find(v => v._id.toString() != req.body._id)) {
  //                     throw new Error("A user already exits with this email");
  //                 }
  //             }
  //         }),

  //     formValidation
  // ],
  // frontUserLogin: [
  //     check('phone')
  //         .notEmpty().withMessage("Phone number is required")
  //         .isLength({ min: 10, max: 10 })
  //         .withMessage("Please enter valid phone numbr")
  //         .isNumeric().withMessage("Enter only number"),
  //     formValidation
  // ],
  // frontValidateOtp: [
  //     check('phone')
  //         .notEmpty().withMessage("Error! Missing something."),

  //     check('otp')
  //         .notEmpty().withMessage("Provide your OTP"),

  //     formValidation
  // ],
  // userOtpSession: async (req, res, next) => {
  //     try {
  //         const docData = await userModel.findOne({ phone: req.body.phone, otp: { $ne: undefined } });
  //         if (((Date.now() - docData?.otp?.time) / 1000) <= config.otpLoginExpDuration) {
  //             next();
  //         } else {
  //             docData.otp = {};
  //             next(Response.createError(Message.otpExpired));
  //             return;
  //         }
  //     } catch (err) {
  //         next(Response.createError(Message.otpExpired));
  //         return;
  //     }
  // },
  // checkUserIsVerified: async (req, res, next) => {
  //     try {
  //         const docData = await userModel.findOne({ phone: req.body.phone, isDeleted: false });
  //         if (!docData.status) {
  //             throw new Error('You are not verified');
  //         } else {
  //             next();
  //         }
  //     } catch (err) {
  //         res.status(200).send({ success: false, message: "You are not verified" })
  //     }
  // },
  // checkUserIsValid: async (req, res, next) => {
  //     try {
  //         const srvRes = await userService.checkAccountStatus({ phone: req.body.phone, email: req.body.email });
  //         if (srvRes.data.accountStatus == 'blocked') {
  //             Response.fail(res, Response.createError(Message.accountBlocked));
  //         } else if (srvRes.data.accountStatus == 'not-active') {
  //             Response.fail(res, Response.createError(Message.accountInactive));
  //         } else if (srvRes.data.accountStatus == 'not-exist') {
  //             throw new Error("Account does not exist")
  //         } else if (srvRes.data.accountStatus == 'active') {
  //             next();
  //         }
  //     } catch (err) {
  //         Response.fail(res, Response.createError(Message.badRequest, err));
  //     }
  // },
  updateUserFront: [
      check("phone")
          .optional()
          .custom(async (value, { req }) => {
              const search = {
                  _id: req.__cuser._id ? { $ne: Types.ObjectId(req.__cuser._id) } : '',
                  phone: value,
                  isDeleted: false,
              };
              clearSearch(search);
              const result = await userModel.find({ ...search });
              if (result?.length) {
                  throw new Error("A user already exits with this phone number");
              }
          })
          .custom((value) => {
              if (value.length !== 10) {
                  return Promise.reject("Phone number should be 10 digits");
              } else {
                  return true;
              }
          }),

      check('name')
          .optional(),

      check('email')
          .optional()
          .isEmail().withMessage("Please enter valid Email")
          .custom(async (value, { req }) => {
              const search = {
                  _id: req.__cuser._id ? { $ne: Types.ObjectId(req.__cuser._id) } : '',
                  email: value,
                  isDeleted: false,
              };
              clearSearch(search);
              const result = await userModel.find({ ...search });
              console.log(result?.length)
              if (result?.length) {
                  throw new Error("A User already exist with this email");
              }
          }),

      formValidation
  ],
  register: [
    check("name").notEmpty().withMessage("Please enter name"),

    check("password").notEmpty().withMessage("Please enter password"),

    check("email")
      .notEmpty()
      .withMessage("Please enter Email")
      .isEmail()
      .withMessage("Please enter valid Email")
      .custom(async (value, { req }) => {
        console.log(req.body);
        const body = req.body;
        const result = await userModel.findOne({ email: value });
        if ((result && !body._id) || (result && result._id != body._id)) {
          throw new Error("A User already exist with this email");
        }
      }),

    check("phone")
      .notEmpty()
      .withMessage("phone number is required")

      .custom((value) => {
        if (value.length !== 10) {
          return Promise.reject("Phone number should be 10 digits");
        } else {
          return true;
        }
      }),

    formValidation,
  ],
};

module.exports = validations;
