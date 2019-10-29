const logger = require('@financial-times/n-logger').default;
const fetch = require('node-fetch');

module.exports = async (req, res, next) => {
	const reqData = {
		method: req.method,
		referrer: req.referrer,
		requestTime: req.requestTime
	}
	logger.info({ event: 'EVENTS_RECEIVED', data: reqData});
	res.json('Data received in IP Events Service v2');
	next();
}