'use strict';

/**
 * Module dependencies.
 */
var PouchDB = require('pouchdb'),
		remote_db_users = PouchDB('http://localhost:5984/db_users'),
		db_users = new PouchDB('db_users'),
		errorHandler = require('./errors');

/**
 * Create a user
 */
exports.create = function(req, res) {
	if(!req.body.firstname) {
    return res.status(400).send({"status": "error", "message": "A firstname is required"});
  } else if(!req.body.lastname) {
    return res.status(400).send({"status": "error", "message": "A lastname is required"});
  } else if(!req.body.email) {
    return res.status(400).send({"status": "error", "message": "A email is required"});
  }

  var user = {
    _id: new Date().toISOString(),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  };

  db_users.put(user).then(
  	function (data) {
      res.send(data);
      //sync databases
      db_users.sync(remote_db_users);
  }).catch(function(err){
 		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
  });
};

/**
 * Show the current user
 */
exports.read = function(req, res) {
	res.json(req.currentUser);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
	if(!req.body.firstname) {
    return res.status(400).send({"status": "error", "message": "A firstname is required"});
  } else if(!req.body.lastname) {
    return res.status(400).send({"status": "error", "message": "A lastname is required"});
  } else if(!req.body.email) {
    return res.status(400).send({"status": "error", "message": "A email is required"});
  }

  var user = {
    _id: req.currentUser._id,
    _rev: req.currentUser._rev, //update user
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  };

  db_users.put(user).then(
  	function (data) {
      res.send(data);
      //sync databases
      db_users.sync(remote_db_users);
  }).catch(function(err){
 		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
  });
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
	var result = db_users.remove(req.currentUser);
	console.log('result: ',result);
};

/**
 * List of Users
 */
exports.list = function(req, res) {
	remote_db_users.allDocs({
	  include_docs: true,
	  attachments: true
	}).then(function (result) {
	  res.send(result);
	}).catch(function (err) {
	  return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	db_users.get(id)
		.then(function (user) {
	  	if (!user) return next(new Error('Failed to load user ' + id));
	  	req.currentUser = user;
			next();	
	}).catch(function (err) {
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// if (req.user.roles.indexOf('admin') == -1) {
	// 	return res.status(403).send('Usuario no autorizado');
	// }
	next();
};