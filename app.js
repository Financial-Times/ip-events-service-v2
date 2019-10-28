const express = require('express');
require('dotenv').config();
const env = process.env.NODE_ENV;
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const logger = require('@financial-times/n-logger').default;

// controllers
const incoming =require('./src/controllers/incoming')
const format = require('./src/controllers/format')
const clients = require('./src/controllers/clients')

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
app.get('/incoming', (req, res) => {
	res.json('The hooks endpoints will listen for events from services like the membership API.');
});
app.post('/incoming', incoming);

// formats events
app.get('/incoming', (req, res) => {
	res.json('The hooks endpoints will listen for events from services like the membership API.');
});
app.post('/format', format);

// forwards events onwards
app.get('/clients', (req, res) => {
	res.json('This will be the endpoint that forwards message to clients like Keen and Spoor.')
});
app.post('/clients/spoor', clients.spoor);

// app.post('/hooks/test', (req, res) => {
// 	// const reqData = {
// 	// 	url: req.url,
// 	// 	method: req.method,
// 	// 	body: req.body,
// 	// 	headers: req.headers
// 	// }
// 	// logger.info({ event: 'KAFKA_TEST_DATA_RECEIVED', data: reqData})
// 	// console.log(`Kafka test message received`)
// 	res.json('Ok cowboy 🤠')
// })

module.exports = app;
