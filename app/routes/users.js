var PouchDB = require('pouchdb');

var remoteCouch = PouchDB('http://localhost:5984/db_users');
 
var Users = new PouchDB('db_users');

var appRouter = function(app) {
	app.post("/api/save", function(req, res) {
		
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
    Users.put(user).then(
    	function (data) {
	      res.send(data);
	      Users.sync(remoteCouch);
    }).catch(function(err){
   		console.log('error: ',err);
    });
	});

	app.get("/api/get", function(req, res) {
		Users.allDocs({
		  include_docs: true,
		  attachments: true
		}).then(function (result) {
		  res.send(result);
		}).catch(function (err) {
		  console.log(err);
		});
	});

	app.post("/api/delete", function(req, res) {
		res.send('/api/delete');
	    // if(!req.body.document_id) {
	    //     return res.status(400).send({"status": "error", "message": "A document id is required"});
	    // }
	    // RecordModel.delete(req.body.document_id, function(error, result) {
	    //     if(error) {
	    //         return res.status(400).send(error);
	    //     }
	    //     res.send(result);
	    // });
	});

	app.get("/api/getAll", function(req, res) {
		// Users.allDocs({
  //     include_docs: true,
  //     descending: true
  //   }, function(err, doc) {
  //     res.send(doc);
  //   });
  remoteCouch.allDocs({
		  include_docs: true,
		  attachments: true
		}).then(function (result) {
		  res.send(result);
		}).catch(function (err) {
		  console.log(err);
		});
		// RecordModel.getAll(function(error, result) {
	    //     if(error) {
	    //         return res.status(400).send(error);
	    //     }
	    //     res.send(result);
	    // });
	});
};

module.exports = appRouter;