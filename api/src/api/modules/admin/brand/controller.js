const BrandService = require("../../../../services/brand");
const Message = require("../../../../utilities/Message");
const Response = require("../../../../utilities/Response");





class brandController {

    static async save(req, res) {
        try {
          const response = {
            data: [],
            message: Message.noContent.message,
            code: Message.noContent.code,
            extra: {},
          };
          const srvRes = await BrandService.save({ ...req.body });
    
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
          const srvRes = await BrandService.list(req.query);
    
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



      static async delete(req, res) {
        try {
          const response = {
            message: Message.dataDeletionError.message,
            code: Message.dataDeletionError.code,
          };
          const srvRes = await BrandService.delete(req.body.ids);
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


module.exports = brandController;
