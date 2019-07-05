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

// everything else through s3o/whitelist

// if (env !== 'test') {
//   app.use(s3o);
//   app.use(whitelist);
// }

const api = express.Router();
api.use(require('./src/middleware/api-key'));

app.get('/', (req, res) => {
	res.send('ip events service v2: 2 events 2 furious');
});

api.get('/hooks', (req, res) => {
	res.send('The hooks endpoints will listen for events from services like the membership and user-preferences apis, and publish formatted events to the queue for consumption.');
});
api.post('/hooks/membership', (req, res) => {
	const uuid = uuidv4()
	console.log(`Kafka message received, uuid ${uuid}`)
	console.log(uuid, req.body)
	res.send('Ok cowboy 🤠')
})
api.get('/consumer', (req, res) => {
	res.send('This will be the endpoint that consumes from the message queue and sends events to different apps.')
});
api.get('/clients', (req, res) => {
	res.send('This will be the endpoint that forwards message to clients like Keen and Spoor.')
});
api.get('/kinesis', (req, res) => {
	res.send('This will be the endpoint that forwards message to the queue (like Kinesis or Rabbit).')
});

app.use('/api', api);

module.exports = app;
