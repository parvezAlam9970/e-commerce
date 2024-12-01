const orderServices = require("../../../../services/order");
const Message = require("../../../../utilities/Message");
const Response = require("../../../../utilities/Response");








class controller {
  static async createSessionBooking(req, res, next) {
    try {
      const response = {
        message: Message.internalServerError.message,
        code: Message.internalServerError.code,
      };
      const srvRes =
        await orderServices.createOrder({
          ...req.body,
          userId: req.__cuser._id,
        });
        console.log(srvRes , "rrrrrrrrrrrrrrr")

      if (srvRes.status) {
        response.data = srvRes.data;
        response.message = "Payment Initialized";
        response.code = 200;
      }
      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataDeletionError, err));
    }
  }

  static async makePaymentSuuccess(req, res, next) {
    try {
      const response = {
        message: Message.internalServerError.message,
        code: Message.internalServerError.code,
      };
      const srvRes = await orderServices.makePaymentSuccess({ ...req.body, userId: req.__cuser._id });


      if (srvRes.status) {
        response.data = srvRes.data;
        response.message = Message.dataSaved.message;
        response.code = Message.dataSaved.code;
      }
      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError("Payment Failed", err));
    }
  }


}
module.exports = controller;
