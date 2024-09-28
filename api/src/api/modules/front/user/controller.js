const userService = require("../../../../services/user");
// const userLoginService = require('../../../../services/userLogin')
// const jwt = require("jsonwebtoken");
// const smsService = require('../../../../services/sms');
const Response = require("../../../../utilities/Response");
var ip = require("ip");

const Message = require("../../../../utilities/Message");
const userLoginServices = require("../../../../services/Otp");
const {
  genRandomNumber,
  encryptData,
} = require("../../../../utilities/Helper");
// const config = require('../../../../config');
// var ip = require('ip');

class controller {
  static async userData(req, res) {
    try {
      const response = {
        data: {},
        message: Message.badRequest.message,
        code: Message.badRequest.code,
        extra: {},
      };
      const srvRes = await userService.userData(req.__cuser._id);
      // response.data = {
      // 	...req.__cuser
      // };
      if (srvRes.status) {
        response.message = Message.dataFound.message;
        response.code = Message.dataFound.code;
        response.data = srvRes?.data;
      }

      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataFetchingError, err));
    }
  }

  static async userUpdate(req, res) {
    try {
      const response = {
        data: {},
        message: Message.noContent.message,
        code: Message.noContent.code,
        extra: {},
      };
      const srvRes = await userService.userUpdate( { ...req.body , _id :   req.__cuser._id});

      if (srvRes.status) {
        response.message = "User updated successfully";
        response.code = Message.dataSaved.code;
        response.data = srvRes?.data;
      }

      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataFetchingError, err));
    }
  }

  static async validateOtp(req, res) {
    try {
      const response = {
        data: {},
        message: Message.badRequest.message,
        code: Message.badRequest.code,
        extra: {},
      };
      const srvRes = await userService.validateOtp(req.body);

      if (srvRes.status) {
        response.data = srvRes.data;
        response.message = Message.otpValidateLogin.message;
        response.code = Message.otpValidateLogin.code;
      } else {
        // Response.fail(res, Response.createError("Invalid Otp"))
        throw new Error(srvRes.data?.message);
      }

      Response.success(res, response);
    } catch (err) {
      Response.fail(res, err);
    }
  }

  // static async acceptTC(req, res) {
  // 	try {
  // 		const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
  // 		const srvRes = await userService.acceptTC({ _id: req.__cuser._id });

  // 		response.data = { isTermsAccepted: srvRes?.data?.isTermsAccepted };
  // 		response.message = Message.TCAccepted.message;
  // 		response.code = Message.TCAccepted.code;

  // 		Response.success(res, response);
  // 	} catch (err) {
  // 		Response.fail(res, Response.createError(Message.dataFetchingError, err));
  // 	}
  // }

  static async login(req, res) {
    try {
      const response = {
        data: [],
        message: Message.noContent.message,
        code: Message.noContent.code,
        extra: {},
      };
      const srvRes = await userService.login({
        email: req.body.email,
        password: req.body.password,
      });

      if (srvRes.status) {
        response.data = srvRes.data;
        response.message = "Login successfully";
        response.code = 200;
        // if (req?.__cuser?._id) {
        // 	try {
        // 		await cartService.moveGuestUserToRegularUser(req.__cuser._id, srvRes.data.userId);
        // 		await userService.deletePermanent(req.__cuser._id);
        // 	} catch (error) {
        // 	}
        // }
      }

      response.extra = srvRes.extra;
      Response.success(res, response);
    } catch (err) {
      // Response.fail(res, Response.createError(Message.dataFetchingError, err));
      Response.fail(res, err);
    }
  }
  static async register(req, res) {
    try {
      const response = {
        data: [],
        message: Message.noContent.message,
        code: Message.noContent.code,
        extra: {},
      };
      const srvRes = await userService.register({ ...req.body });

      if (srvRes.status) {
        response.data = srvRes.data;
        response.message = "signUp successfully";
        response.code = 200;
      }

      response.extra = srvRes.extra;
      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataFetchingError, err));
    }
  }

  static async sendOtp(req, res) {
    console.log(req.body)
    try {
      const response = {
        data: {},
        message: Message.dataNotFound.message,
        code: Message.dataNotFound.code,
        extra: {},
      };
      const srvResUser = await userService.sendOtp(req.body);
      if (srvResUser.status) {
        const responseObj = {
          key: "",
          isNumber_verified: srvResUser?.data?.isEmailVerified,
        };
        if (!responseObj.isEmailVerified) {
          const expireTime = new Date();
          expireTime.setMinutes(expireTime.getMinutes() + 30);

          const srvResUserLogin = await userLoginServices.save({
            userId: srvResUser.data?._id,
            ip: ip.address(),
            otp: {
              value: genRandomNumber(4),
              expireTime: expireTime,
            },
          });

          console.log(srvResUserLogin);

          responseObj.key = encryptData(srvResUserLogin.data._id.toString());
          responseObj.otp = srvResUserLogin.data.otp.value;
        }

        response.data = responseObj;
        // await smsService.send('user-login-otp', { phone: req.body.phone, otp: srvResDealerLogin.data.otp.value });
        response.message = Message.otpSent.message;
        response.code = Message.otpSent.code;
      }

      Response.success(res, response);
    } catch (e) {
      Response.fail(res, Response.createError(Message.dataFetchingError, e));
    }
  }

  // static async isTCvalidate(req, res) {
  // 	try {
  // 		const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
  // 		const srvRes = await userService.isTCvalidate({ _id: req.__cuser._id });

  // 		response.data = { isTermsAccepted: srvRes?.data?.isTermsAccepted };
  // 		response.message = Message.TCAccepted.message;
  // 		response.code = Message.TCAccepted.code;

  // 		Response.success(res, response);
  // 	} catch (err) {
  // 		Response.fail(res, Response.createError(Message.dataFetchingError, err));
  // 	}
  // }

  // static async userData(req, res) {
  // 	try {
  // 		const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
  // 		const srvRes = await userService.userData(req.__cuser._id);
  // 		if (srvRes.status) {
  // 			response.data = {
  // 				...srvRes.data,
  // 			};
  // 			response.message = Message.dataFound.message;
  // 			response.code = Message.dataFound.code;
  // 		}

  // 		Response.success(res, response);
  // 	} catch (err) {
  // 		Response.fail(res, Response.createError(Message.dataFetchingError, err));
  // 	}
  // }

  // static async userUpdate(req, res) {
  // 	try {
  // 		const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
  // 		const srvRes = await userService.userUpdate({ ...req.body, _id: req.__cuser._id });

  // 		if (srvRes.status) {
  // 			response.message = "user updated"
  // 			response.code = Message.msgOk.code;
  // 		}

  // 		Response.success(res, response);

  // 	} catch (err) {
  // 		Response.fail(res, Response.createError(Message.dataFetchingError, err));

  // 	}
  // }

  // static async updateTermsAcceptance(req, res) {
  // 	try {
  // 		const response = { data: null, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
  // 		const srvRes = await userService.saveDealerByKeys({ _id: req.__cuser._id, termAccepted: req.body.termAccepted });

  // 		if (srvRes.status) {
  // 			response.data = null;
  // 			response.message = req.body.termAccepted ? "Terms & Condition Accepted" : "Terms & Condition Not Accepted";
  // 			response.code = Message.msgOk.code;
  // 		}

  // 		Response.success(res, response);
  // 	} catch (err) {
  // 		Response.fail(res, Response.createError(Message.dataFetchingError, err));
  // 	}
  // }

  // static async getTermsAcceptance(req, res) {
  // 	try {
  // 		const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
  // 		const srvRes = await userService.userData(req.__cuser._id);

  // 		if (srvRes.status && srvRes.data) {
  // 			response.data = {
  // 				termAccepted: Boolean(srvRes.data?.termAccepted)
  // 			};
  // 			response.message = Message.dataFound.message;
  // 			response.code = Message.dataFound.code;
  // 		}

  // 		Response.success(res, response);
  // 	} catch (err) {
  // 		Response.fail(res, Response.createError(Message.dataFetchingError, err));
  // 	}
  // // }
  // static async deleteUser(req, res) {
  // 	try {
  // 		const response = { message: Message.dataDeletionError.message, code: Message.dataDeletionError.code };
  // 		const srvRes = await userService.deleteCurrentUser({ _id: req.__cuser._id });
  // 		if (srvRes.status) {
  // 			response.message = Message.dataDeleted.message;
  // 			response.code = Message.dataDeleted.code;
  // 		}
  // 		Response.success(res, response);
  // 	} catch (err) {
  // 		Response.fail(res, Response.createError(Message.dataDeletionError, err));
  // 	}
  // }
}

module.exports = controller;
