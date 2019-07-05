require('dotenv').config()

module.exports = (req, res, next) => {
	if (req.headers.apikey === process.env.APIKEY) {
		next();
	} else {
		res.status(401).json('You need an API key, soz');
	}
};
