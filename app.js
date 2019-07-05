const express = require('express');
require('dotenv').config();
const env = process.env.NODE_ENV;
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// healthchecks outside s3o

app.get('/__gtg', (req, res) => {
  res.send('Good to go 👍'); 
});
// app.get('/__health', healthChecks);

const api = express.Router();

if (env !== 'test') {
	api.use(require('./src/middleware/api-key'));
}

app.get('/', (req, res) => {
	res.json('ip events service v2: 2 events 2 furious');
});

api.get('/hooks', (req, res) => {
	res.json('The hooks endpoints will listen for events from services like the membership and user-preferences apis, and publish formatted events to the queue for consumption.');
});
api.post('/hooks/membership', (req, res) => {
	const uuid = uuidv4()
	console.log(`Kafka message received, uuid ${uuid}`)
	console.log(uuid, req.body)
	res.json('Ok cowboy 🤠')
})
api.post('/hooks/test', (req, res) => {
	console.log(`Kafka test message received`)
	res.json('Ok cowboy 🤠')
})
api.get('/consumer', (req, res) => {
	res.json('This will be the endpoint that consumes from the message queue and sends events to different apps.')
});
api.get('/clients', (req, res) => {
	res.json('This will be the endpoint that forwards message to clients like Keen and Spoor.')
});
api.get('/kinesis', (req, res) => {
	res.json('This will be the endpoint that forwards message to the queue (like Kinesis or Rabbit).')
});

app.use('/api', api);

module.exports = app;
