const adminService = require("../../../../services/admin");
const userService = require("../../../../services/user");
// const addressService = require('../../../../services/address');
const Response = require("../../../../utilities/Response");
const Message = require("../../../../utilities/Message");
const AddressService = require("../../../../services/address");

class controller {
  static async login(req, res) {
    try {
      const response = {
        data: [],
        message: Message.noContent.message,
        code: Message.noContent.code,
        extra: {},
      };
      const srvRes = await adminService.login({
        email: req.body.email,
        password: req.body.password,
      });

      if (srvRes.status) {
        response.data = srvRes.data;
        response.message = "Loggedin successfully";
        response.code = 200;
      }

      response.extra = srvRes.extra;
      Response.success(res, response);
    } catch (err) {
      // Response.fail(res, Response.createError(Message.dataFetchingError, err));
      Response.fail(res, err);
    }
  }
  static async validateToken(req, res) {
    try {
      Response.success(res, {
        message: "Authorized",
        data: { type: req.__cuser.type },
      });
    } catch (e) {
      Response.fail(res, e);
    }
  }
  static async updatePassword(req, res) {
    try {
      const srvRes = await adminService.updatePassword({
        ...req.body,
        _id: req.__cuser._id,
      });
      Response.success(res, srvRes);
    } catch (e) {
      Response.fail(res, e);
    }
  }
  static async profile(req, res) {
    try {
      const srvRes = await adminService.profile(req.__cuser);
      Response.success(res, srvRes);
    } catch (e) {
      Response.fail(res, e);
    }
  }
  static async saveProfile(req, res) {
    try {
      const srvRes = await adminService.saveProfile(req.body, req.__cuser);
      Response.success(res, srvRes);
    } catch (e) {
      Response.fail(res, e);
    }
  }

  static async changeAvatar(req, res) {
    try {
      const srvRes = await adminService.changeAvatar({
        ...req.body,
        adminId: req.__cuser._id,
      });
      Response.success(res, srvRes);
    } catch (e) {
      Response.fail(res, e);
    }
  }

  static async list(req, res) {
    try {
      const response = {
        data: [],
        message: Message.noContent.message,
        code: Message.noContent.code,
        extra: {},
      };
      const srvRes = await adminService.list(req.query);

      if (srvRes.data.length) {
        response.data = srvRes.data;
        response.message = Message.dataFound.message;
        response.code = Message.dataFound.code;
      }

      response.extra = srvRes.extra;
      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataFetchingError, err));
    }
  }
  static async save(req, res) {
    try {
      const response = {
        message: Message.internalServerError.message,
        code: Message.internalServerError.code,
      };
      const srvRes = await adminService.save({ ...req.body });
      if (srvRes.status) {
        response.message = Message.dataSaved.message;
        response.code = Message.dataSaved.code;
      }
      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataDeletionError, err));
    }
  }
  static async delete(req, res) {
    try {
      const response = {
        message: Message.dataDeletionError.message,
        code: Message.dataDeletionError.code,
      };
      const srvRes = await adminService.delete(req.body.ids);
      if (srvRes.status) {
        response.message = Message.dataDeleted.message;
        response.code = Message.dataDeleted.code;
      }
      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataDeletionError, err));
    }
  }

  /// User controller

  static async listAddress(req, res) {
    try {
      const response = {
        data: [],
        message: Message.noContent.message,
        code: Message.noContent.code,
        extra: {},
      };
      const srvRes = await AddressService.list(req.query);

      if (srvRes.data.length) {
        response.data = srvRes.data;
        response.message = Message.dataFound.message;
        response.code = Message.dataFound.code;
      }

      response.extra = srvRes.extra;
      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataFetchingError, err));
    }
  }

  static async saveAddress(req, res) {
    try {
      const response = {
        message: Message.internalServerError.message,
        code: Message.internalServerError.code,
      };
      const srvRes = await AddressService.save({ ...req.body });
      if (srvRes.status) {
        response.message = Message.dataSaved.message;
        response.code = Message.dataSaved.code;
      }
      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataDeletionError, err));
    }
  }
  static async detailsAddress(req, res) {
    try {
      const response = {
        data: {},
        message: Message.noContent.message,
        code: Message.noContent.code,
        extra: {},
      };
      const srvRes = await AddressService.details(req.params._id);

      if (srvRes.data?._id) {
        response.data = srvRes.data;
        response.message = Message.dataFound.message;
        response.code = Message.dataFound.code;
      }

      response.extra = srvRes.extra;
      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataFetchingError, err));
    }
  }
  static async deleteAddress(req, res) {
    try {
      const response = {
        message: Message.dataDeletionError.message,
        code: Message.dataDeletionError.code,
      };
      const srvRes = await AddressService.delete(req.body.ids);
      if (srvRes.status) {
        response.message = Message.dataDeleted.message;
        response.code = Message.dataDeleted.code;
      }
      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataDeletionError, err));
    }
  }

  /// User controller

  static async listUser(req, res) {
    try {
      const response = {
        data: [],
        message: Message.noContent.message,
        code: Message.noContent.code,
        extra: {},
      };
      const srvRes = await userService.listUser(req.query);

      if (srvRes.data.length) {
        response.data = srvRes.data;
        response.message = Message.dataFound.message;
        response.code = Message.dataFound.code;
      }

      response.extra = srvRes.extra;
      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataFetchingError, err));
    }
  }

  static async saveUser(req, res) {
    try {
      const response = {
        message: Message.internalServerError.message,
        code: Message.internalServerError.code,
      };
      const srvRes = await userService.profileUpadte({
        ...req.body,
        // avatar: req.body?.avatar?.url ?? null,
      });
      if (srvRes.status) {
        response.message = Message.dataSaved.message;
        response.code = Message.dataSaved.code;
      }
      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataDeletionError, err));
    }
  }
  static async detailsUser(req, res) {
    try {
      const response = {
        data: {},
        message: Message.noContent.message,
        code: Message.noContent.code,
        extra: {},
      };
      const srvRes = await userService.detailsUser(req.params._id);

      if (srvRes.data?._id) {
        response.data = srvRes.data;
        response.message = Message.dataFound.message;
        response.code = Message.dataFound.code;
      }

      response.extra = srvRes.extra;
      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataFetchingError, err));
    }
  }
  static async deleteUser(req, res) {
    try {
      const response = {
        message: Message.dataDeletionError.message,
        code: Message.dataDeletionError.code,
      };
      const srvRes = await userService.deleteUser(req.body.ids);
      if (srvRes.status) {
        response.message = Message.dataDeleted.message;
        response.code = Message.dataDeleted.code;
      }
      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataDeletionError, err));
    }
  }
}

module.exports = controller;
