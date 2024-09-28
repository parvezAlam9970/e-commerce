const express = require('express');
const path = require('path');
require('dotenv/config');
const config = require('./config');
const initLoader = require('./loaders');
const Logger = require('./utilities/Logger');

global.appRoot = path.resolve(__dirname);


Logger.init({ level: config.logs.level });

process.on('uncaughtException', function (error) {
	Logger.error("Uncaught Exception : ");
	console.log(error.message)
	Logger.error(error);
});

(async () => {
	try {
		const app = express();
		app.use(require('cors')({origin: '*'}));
		app.use(express.static(path.join(__dirname, '..', 'public')));
		const server = app.listen(config.port, err => {
			console.log("port"   , + config.port)
			if (err) {
				Logger.error('', err);
				process.exit(1);
				return;
			}
			Logger.log(
				'info',
				`
					################################################
					🛡️  Server listening on port: ${config.port} 🛡️
					################################################
				`,
			);

		});

		await initLoader({ expressApp: app, server });
	} catch (e) {
		// Deal with the fact the chain failed
		Logger.error('', e);
	}
})();



