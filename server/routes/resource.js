const dbo = require("../db/conn");
const { ObjectId } = require("mongodb");
const resourceRoutes = require("express").Router();
 
// Fetch all resources.
resourceRoutes.route("/resources").get(async (req, res) => {
 let db_connect = dbo.getDb();
 db_connect
   .collection("resources")
   .find({})
   .toArray()
   .then(data => {
     return res.json(data);
   });
});

// Add a resource.
resourceRoutes.route("/resource/add").post(async (req, res) => {
  let db_connect = dbo.getDb();
  let myobj = {
    title: req.body.title,
    data: req.body.data, 
    date: req.body.date
  };
  db_connect
    .collection("resources")
    .insertOne(myobj)
    .then(data => {
      return res.json(data);
  })
});

resourceRoutes.route("/resource/update/text").post(async (req, res) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.body.id) };
  let newvalues = {
    $set: { 
      data: req.body.text,
    },
  };
  db_connect
    .collection("resources")
    .updateOne(myquery, newvalues)
    .then(data => {
      return res.json(data);
    });
 });


resourceRoutes.route("/resource/delete").post(async (req, res) => {
 let db_connect = dbo.getDb();
 let myquery = { title: req.body.title };
 db_connect
  .collection("resources")
  .deleteOne(myquery)
  .then(data => {
      return res.json(data);
  });
});
 
module.exports = resourceRoutes;