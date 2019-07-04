const app = require('./app');
const port = process.env.PORT || 1313;
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host, () => console.log(`App listening on ${host}:${port}!`));