const express = require('express');
require('dotenv').config();
const env = process.env.NODE_ENV;
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const logger = require('@financial-times/n-logger').default;

// controllers
const hooks = require('./src/controllers/hooks')

// app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// healthchecks outside s3o

app.get('/__gtg', (req, res) => {
  res.send('Good to go 👍'); 
});
// app.get('/__health', healthChecks);

app.get('/', (req, res) => {
	const reqData = {
		url: req.url,
		method: req.method,
		headers: req.headers
	}
	logger.info({ event: 'ENDPOINT_VISIT', data: reqData})
	res.json('ip events service v2: 2 events 2 furious');
});

if (env !== 'test') {
	app.use(require('./src/middleware/api-key'));
}

// receives events
app.get('/hooks', (req, res) => {
	res.json('The hooks endpoints will listen for events from services like the membership and user-preferences apis, and publish formatted events to the queue for consumption.');
});
app.post('/hooks/membership', hooks.formatMembership);
app.post('/hooks/user-preferences', hooks.formatUserPreferences);
app.post('/hooks/test', (req, res) => {
	// const reqData = {
	// 	url: req.url,
	// 	method: req.method,
	// 	body: req.body,
	// 	headers: req.headers
	// }
	// logger.info({ event: 'KAFKA_TEST_DATA_RECEIVED', data: reqData})
	// console.log(`Kafka test message received`)
	res.json('Ok cowboy 🤠')
})

// forwards events onwards
app.get('/clients', (req, res) => {
	res.json('This will be the endpoint that forwards message to clients like Keen and Spoor.')
});

module.exports = app;
