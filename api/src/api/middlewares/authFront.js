const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const Response = require('../../utilities/Response');
const Message = require('../../utilities/Message');
const config = require('../../config');
const userModel = require('../../models/user');

module.exports = {

	setCuserInfo: async function (req, res, next) {
		try {
			const bearer = req.headers.authorization.split(" ");
			const token = bearer[1];
			const decode = jwt.verify(token, config.jwt.secretKey);

			const cuser = await userModel.findOne({ _id: decode.sub, isDeleted: false });
			req.__cuser = cuser;
		} catch (e) { } finally {
			next();
		}
	},


	validateTokenFront: async function (req, res, next) {
		try {
			if (req.headers.authorization && req.headers.authorization.split(" ")[1] != 'undefined') {
				const authorization = req.headers.authorization.trim();
				
				if (authorization.startsWith('Bearer ')) {
					const bearer = req.headers.authorization.split(" ");
					const token = bearer[1];
					const decode = jwt.verify(token, config.jwt.secretKey);
					console.log(decode)
					try {
						const cuser = await userModel.findOne({ _id: decode._id, isDeleted: false });
						if (!cuser) {
							throw new Error();
						} else if (!cuser.status) {
							Response.fail(res, 'Account is blocked. Contact Admin!!', HttpStatus.StatusCodes.UNAUTHORIZED);
							return;
						}
						req.__cuser = cuser;
						// req.query.ln = cuser?.preferredLn || 'en';
					} catch (e) {
						throw new Error();
					}
					next();
					
				} else {
					throw Response.createError(Message.invalidToken);
				}
			} else {
				throw new Error();
			}

		} catch (e) {
			Response.fail(res, 'Unauthorized! Try login again.', HttpStatus.StatusCodes.UNAUTHORIZED);
		}
	},
	restrictGuest: async function (req, res, next) {
		try {
			if (req.headers.authorization && req.headers.authorization.split(" ")[1] != 'undefined') {
				const authorization = req.headers.authorization.trim();

				if (authorization.startsWith('Bearer ')) {
					const bearer = req.headers.authorization.split(" ");
					const token = bearer[1];
					const decode = jwt.verify(token, config.jwt.secretKey);
					try {
						
						const cuser = await userModel.findOne({ _id: decode.sub, isDeleted: false });
						if (!cuser) {
							throw new Error();
						} else if (cuser.type === 'guest') {
							Response.fail(res, 'Unauthorized! Try login again.', HttpStatus.StatusCodes.UNAUTHORIZED);
							return;
						}
					} catch (e) {
						throw new Error();
					}
					next();

				} else {
					throw Response.createError(Message.invalidToken);
				}
			} else {
				throw new Error();
			}

		} catch (e) {
			Response.fail(res, 'Unauthorized! Try login again.', HttpStatus.StatusCodes.UNAUTHORIZED);
		}
	},

	validateTokenWithoutError: async function (req, res, next) {
		try {
			const decode = jwt.verify(req.headers.authorization.split(" ")?.[1], config.jwt.secretKey);
			const cuser = await userModel.findOne({ _id: decode.sub, isDeleted: false });
			req.__cuser = cuser;
		} catch (e) {
		} finally {
			next()
		}
	},


	checkPlanPurchased: async (req, res, next) => {
		try {
			if (req.__cuser.planPurchased) {
				next();
			} else {
				throw new Error();
			}
		} catch (e) {
			Response.fail(res, 'Plan not purchased', HttpStatus.StatusCodes.UNAUTHORIZED);
		}
	},

};