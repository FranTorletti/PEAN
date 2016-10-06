'use strict';

/**
 * Module dependencies.
 */

var users = require('../../app/controllers/users');

module.exports = function(app) {
	// User Routes
	app.route('/api/users')
		.get(users.list)
		.post(users.hasAuthorization, users.create);

	app.route('/api/users/:userId')
		.get(users.hasAuthorization, users.read)
		.put(users.hasAuthorization, users.update)
		.delete(users.hasAuthorization, users.delete);

	// Finish by binding the article middleware
	app.param('userId', users.userByID);
};