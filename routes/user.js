var config = require('../config');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var express = require('express');

var apiRoutes = express.Router();

exports.setup = function(req, res, next) {
	var nick = new User({
		name: 'hoangnv',
		password: '123',
		admin: true
	});

	nick.save(function(err) {
		if (err) {
			throw err;
		}

		console.log('User save successfully');
		res.json({
			success: true
		});
	});
};

apiRoutes.post('/authenticate', function(req, res, next) {
	// find user
	User.findOne({
		name: req.body.name
	}, function(err, user) {
		if (err) {
			throw err;
		}

		if (!user) {
			res.json({
				success: false,
				message: 'Authenticate failed'
			});
		}

		if (user.password !== req.body.password) {
			res.json({
				success: false,
				message: 'Authenticate failed'
			});	
		}

		var token = jwt.sign(user, config.secret, {
			expiresIn: 86400
		});

		res.json({
			success: true,
			message: 'Authenticate success',
			token: token
		});
	});
});

apiRoutes.use(function(req, res, next) {
	// check header or url parameters or post parameters for toke
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (!token) {
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}

	jwt.verify(token, config.secret, function(err, decoded) {
		if (err) {
			return res.json({
				success: false,
				message: 'No token provided.'
			});
		}

		req.decoded = decoded;
		next();
	});
});

apiRoutes.get('/users', function(req, res, next) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

exports.apiRoutes = apiRoutes;

exports.login = function(req, res, next) {
	res.render('login', {
		title: 'Login'
	});
};