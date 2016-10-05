var PouchDB = require('pouchdb');
 
var UserDB = new PouchDB('users');

var remoteCouch = PouchDB('http://localhost:5984/users');

module.exports.users = UserDB;