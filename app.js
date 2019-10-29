const express = require('express');
require('dotenv').config();
const env = process.env.NODE_ENV;
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const logger = require('@financial-times/n-logger').default;

// middleware
const requestTime = require('./src/middleware/requestTime')
const format = require('./src/middleware/format')

// controllers
const incoming =require('./src/controllers/incoming')

// app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// healthchecks outside s3o

app.get('/__gtg', (req, res) => {
  res.send('Good to go 👍'); 
});
// app.get('/__health', healthChecks);

app.get('/', (req, res) => {
	res.json('ip events service v2: 2 events 2 furious');
});

if (env === 'prod') {
	app.use(require('./src/middleware/apiKey'));
}

app.use(requestTime)

// receives events
app.get('/incoming', (req, res) => {
	res.json('The hooks endpoints will listen for events from services like the membership API.');
});
app.post('/incoming', incoming);

// formats events and forwards them to clients
app.use(format)

// test endpoint needed for Kafka Bridge
app.post('/hooks/test', (req, res) => {
	const reqData = {
		url: req.url,
		method: req.method,
		body: req.body,
		headers: req.headers
	}
	logger.info({ event: 'KAFKA_TEST_DATA_RECEIVED', data: reqData})
	res.json('Ok cowboy 🤠')
})

module.exports = app;
