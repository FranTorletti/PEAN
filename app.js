
/**
 * Module dependencies.
 */

var express = require('express')
  , path = require('path')
  , morgan = require('morgan')
  , PouchDB = require('pouchdb')
  , bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json())

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/db', require('express-pouchdb')(PouchDB));

app.use(bodyParser.json())

var routes = require("./app/routes/users.js")(app);

app.listen(3000);
console.log("Express server listening on port " + 3000);
