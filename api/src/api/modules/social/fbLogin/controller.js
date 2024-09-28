const userService = require('../../../../services/user');
const Response = require('../../../../utilities/Response');
const Message = require('../../../../utilities/Message');

class controller {
	static async login(req, res) {
		try {
			const response = { data: [], message: Message.noContent.message, code: Message.noContent.code, extra: {} };
			const srvRes = await userService.login({});

			if (srvRes.status) {
				response.data = srvRes.data;
				response.message = 'Loggedin successfully';
				response.code = 200;
			}

			response.extra = srvRes.extra;
			Response.success(res, response);
		} catch (err) {
			Response.fail(res, err);
		}
	}
	

}

module.exports = controller;