const findRemoveSync = require('find-remove');
const Logger = require('../utilities/Logger');
const { TempFileDir } = require('../config');
const userModel = require('../models/user');
// const cartModel = require('../models/cart');
const { Types } = require('mongoose');
const cron = require("node-cron")
class Schedule {
	static async init() {
		Schedule.deleteTempFiles();
		Schedule.deletedGuestUsers();
	}

	/**
	 * @description deletes old temporary files older than 10 hours every hour
	 */
	static deleteTempFiles() {
		setInterval(() => {
			// Logger.info('Deleting temporary files', { TempFileDir });

			// const result = findRemoveSync(TempFileDir, { age: { seconds: 36000 * 360}, files: '*.*', ignore: '.gitkeep' });

			// Logger.info(`Deleted temporary files: ${Object.values(result).length}`);
		}, 3600000);
	}

	static deletedGuestUsers() {
		cron.schedule('0 0 * * *', async () => {
			const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
			const allExpiredGuestUsers = await userModel.find({
				type: 'guest',
				createdAt: { $gte: tenDaysAgo }
			});
			if (allExpiredGuestUsers.length > 0) {
				for (const user of allExpiredGuestUsers) {
					// await cartModel.deleteOne({ userId: Types.ObjectId(user?._id) });
					await userModel.deleteOne({ _id: Types.ObjectId(user?._id) })
					Logger.info(`Deleted Guest User Doc and cart`);

				}
			}

		});
	}
}

module.exports = Schedule;
