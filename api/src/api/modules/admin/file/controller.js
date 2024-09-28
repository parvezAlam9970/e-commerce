const service = require('../../../../services/file');
const Response = require('../../../../utilities/Response');

module.exports = class controller {

	static async save(req, res) {
		try {
			const srvRes = await service.save(req);
			Response.success(res, srvRes);
		} catch (e) {

			console.log(e, "error")
			Response.fail(res, e);
		}
	}

	static async remove(req, res) {
		try {
			const srvRes = await service.remove(req);
			Response.success(res, srvRes);
		} catch (e) {
			Response.fail(res, e);
		}
	}

}