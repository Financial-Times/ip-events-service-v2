const logger = require('@financial-times/n-logger').default;
const fetch = require('node-fetch');
const host = new URL(process.env.SPOOR_HOST);
const method = "POST"
const headers = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"spoor-region": "EU", // does this need to be randomly assigned to different regions like in v1?
	"User-Agent": "ip-events-service-v2/v1.0"
};

const sendToSpoor = async (body) => {
	fetch(host, {
		method,
		body: JSON.stringify(body),
		headers
	}).then((response) => {
		if (!response.ok) {
			throw new Error('Failed to send to Spoor');
		}
		logger.info({event: 'SENT_TO_SPOOR', ok: response.ok, text: response.text()});
	}, (error) => {
		logger.warn({event: 'ERROR', error: error});
	})
};

module.exports = { sendToSpoor };