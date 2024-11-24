const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');
const AddressService = require('../../../../services/address');

class controller {
	static async listAddress(req, res) {
		try {
			const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
			const srvRes = await AddressService.list({ ...req.query, userId: req.__cuser._id });

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
			const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
			const srvRes = await AddressService.save({ ...req.body, userId: req.__cuser._id });

			if (srvRes.status) {
				response.data = srvRes.data;
				response.message = Message.dataSaved.message;
				response.code = Message.dataSaved.code;
			}

			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}

	static async deleteAddress(req, res) {
		try {
			const response = { data: {}, message: Message.badRequest.message, code: Message.badRequest.code, extra: {} };
			const srvRes = await AddressService.delete(req.body.ids);

			if (srvRes.status) {
				response.data = srvRes.data;
				response.message = Message.dataDeleted.message;
				response.code = Message.dataDeleted.code;
			}

			Response.success(res, response);
		} catch (err) {
			Response.fail(res, Response.createError(Message.dataFetchingError, err));
		}
	}
}

module.exports = controller;