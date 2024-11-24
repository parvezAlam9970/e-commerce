const cartServices = require("../../../../services/cart");
const Message = require("../../../../utilities/Message");
const Response = require("../../../../utilities/Response");



class controller {

    static async save(req, res) {
        try {
          const response = {
            data: [],
            message: Message.noContent.message,
            code: Message.noContent.code,
            extra: {},
          };
          console.log(req.body)
          const srvRes = await cartServices.save({ ...req.body ,  userId  : req.__cuser._id});
    
          if (srvRes.status) {
            response.data = srvRes.data;
            response.message = Message.dataSaved.message;
            response.code = 200;
          }
    
          Response.success(res, response);
        } catch (err) {
          Response.fail(res, Response.createError(Message.dataFetchingError, err));
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
          const srvRes = await cartServices.listFront({...req.query , userId: req.__cuser._id});
    
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

      
      static async calculatePrice(req, res) {
        try {
          const response = {
            data: [],
            message: Message.noContent.message,
            code: Message.noContent.code,
            extra: {},
          };
          const srvRes = await cartServices.calculatePrice({userId: req.__cuser._id});
    
          if (srvRes) {
            response.data = srvRes;
            response.message = Message.dataFound.message;
            response.code = Message.dataFound.code;
          }
    
          response.extra = srvRes.extra;
          Response.success(res, response);
        } catch (err) {
          Response.fail(res, Response.createError(Message.dataFetchingError, err));
        }
      }


}
    module.exports = controller;
