require('dotenv').config()
var test = require('tape');
var request = require('supertest');
var app = require('../app');

test('Correct homepage response sent', function (t) {
	request(app)
	  .get('/')
	  .expect('Content-Type', 'application/json; charset=utf-8')
	  .expect(200)
	  .end(function (err, res) {
		t.error(err, 'No error');
		t.same(res.body, 'ip events service v2: 2 events 2 furious', 'Response as expected');
		t.end();
	  });
  });

  test('No access without API key', function (t) {
	request(app)
	  .get('/api/hooks')
	  .expect('Content-Type', 'application/json; charset=utf-8')
	  .expect(401)
	  .end(function (err, res) {
		t.error(err, 'No error');
		t.same(res.body, 'You need an API key, soz', 'No API key, unauthorised');
		t.end();
	  });
  });

  test('Access granted with API key', function (t) {
	request(app)
	  .get('/api/hooks')
	  .set('apikey', process.env.APIKEY)
	  .expect('Content-Type', 'application/json; charset=utf-8')
	  .expect(200)
	  .end(function (err, res) {
		t.error(err, 'No error');
		t.same(res.body, 'The hooks endpoints will listen for events from services like the membership and user-preferences apis, and publish formatted events to the queue for consumption.', 'Correct API key provided');
		t.end();
	  });
  });

  test('POST request responds as expected', function (t) {
	request(app)
	  .post('/api/hooks/membership')
	  .set('apikey', process.env.APIKEY)
	  .expect('Content-Type', 'application/json; charset=utf-8')
	  .expect(200)
	  .end(function (err, res) {
		t.error(err, 'No error');
		t.same(res.body, 'Ok cowboy 🤠', 'Successful POST request');
		t.end();
	  });
  });