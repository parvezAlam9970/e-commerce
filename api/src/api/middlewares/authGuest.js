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

			// const cuser = await userModel.findOne({ _id: decode.sub, isDeleted: false });
			req.__cuser = cuser;
		} catch (e) { } finally {
			next();
		}
	},


	validateGuestToken: async function (req, res, next) {
		try {
			if (req.headers.authorization) {
				const authorization = req.headers.authorization.trim();

				if (authorization.startsWith('Bearer ')) {
					const bearer = req.headers.authorization.split(" ");
					const token = bearer[1];
					const decode = jwt.verify(token, config.jwt.secretKey);
					if (decode.type === "guest") {
						try {
							const cuser = await userModel.findOne({ _id: decode.sub, isDeleted: false, type: "guest" });
							if (!cuser) {
								throw new Error();
							} else if (!cuser.status) {
								Response.fail(res, 'FAILED TO FIND GUEST ACCOUNT', HttpStatus.StatusCodes.NOT_FOUND);
								return;
							}
							req.__cuser = cuser;
							// req.query.ln = cuser?.preferredLn || 'en';
							next();
						} catch (e) {
							throw new Error();
						}
					} else { next(); }
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


	setGuestToken: async function (req, res, next) {
		try {
			if (!req.headers.authorization) {
				// then create the guest user:
				const guestDoc = await userModel.create({
					name: "Guest User",
					type: "guest"
				});
				await guestDoc.save();

				// now create a temp token for partial access of our website:
				req.body.tempAccessToken = jwt.sign(
					{
						sub: guestDoc._id?.toString(),
						type: "guest",
						exp: Math.floor(Date.now() / 1000) + ((config.jwt.expDuration) * 60)
					},
					config.jwt.secretKey)
				req.headers.authorization = `Bearer ${req.body.tempAccessToken}`;
				next();
			} else {
				next();
			}
		} catch (error) {
			Response.fail(res, 'Failed to Login as guest', HttpStatus.StatusCodes.UNAUTHORIZED);
		}
	}

};