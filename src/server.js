var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var apiRouter = express.Router();

var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(express.static(__dirname + "/../dist"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to
// reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
console.log('connecting to', process.env.MONGODB_URI);

mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});


// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/contacts"
*    GET: finds all contacts
*    POST: creates a new contact
*/
apiRouter.route("/contacts")
  .get(function(req, res) {
    db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get contacts.");
      } else {
        res.status(200).json(docs);
      }
    });
  })
  .post(function(req, res) {
      var newContact = req.body;
      newContact.createDate = new Date();

      if (!req.body.name) {
        handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
      }

      db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to create new contact.");
        } else {
          res.status(201).json(doc.ops[0]);
        }
      });
  });

/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */
apiRouter.route('/contacts/:id')
  .get(function(req, res) {
    db.collection(CONTACTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get contact");
      } else {
        res.status(200).json(doc);
      }
    });
  })
  .put(function(req, res) {
    var updateDoc = req.body;
    var saver = updateDoc._id;
    delete updateDoc._id;

    db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, {$set: updateDoc}, function(err, doc) {
      if (err) {
        console.log('in the update db errr handler!!!!');
        handleError(res, err.message, "Failed to update contact");
      } else {
        updateDoc._id = saver;
        res.status(200).json(updateDoc);
      }
    });
  })
  .delete(function(req, res) {
    var delId = req.params.id;
    db.collection(CONTACTS_COLLECTION).deleteOne({_id: new ObjectID(delId)}, function(err, result) {
      if (err) {
        handleError(res, err.message, "Failed to delete contact");
      } else {
        res.status(200).json(delId);
      }
    });
  });

app.use('/api', apiRouter);
