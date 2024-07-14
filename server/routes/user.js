const dbo = require("../db/conn");
const userRoutes = require("express").Router();
const jwt = require("jsonwebtoken")
const { ObjectId } =  require("mongodb");
const bcrypt = require("bcrypt")

const { createSecretToken } = require("../util/SecretToken");

userRoutes.route("/signup").post(async (req, res) => {
 let db_connect = dbo.getDb();
 let myquery = { username : req.body.username };
 db_connect
   .collection("users")
   .findOne(myquery)
   .then(async found => {
     if (found) {
       return res.json({ message: "User already exists", success: false });
     }
     let newvalues = {
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 12),
        notes: []
     };
    db_connect
      .collection("users")
      .insertOne(newvalues)
      .then(data => {
        res.cookie("token", createSecretToken(data.insertedId), {
          withCredentials: true,
          httpOnly: false,
        });
        return res.json({ message: "Sign up successful", success: true });
      });
    });
  });

userRoutes.route("/login").post(async (req, res) => {
  let db_connect = dbo.getDb();
  let { username, password } = req.body;
  db_connect
    .collection('users')
    .findOne({ username })
    .then(async user => {
      if (!user) {
        return res.json({ message: 'Invalid credentials', success: false});
      }
      const auth = await bcrypt.compare(password, user.password);
      if (!auth) {
        return res.json({ message: 'Invalid credentials', success: false});
      }
      res.cookie("token", createSecretToken(user._id), {
        withCredentials: true,
        httpOnly: false,
      });
      return res.json({ message: "Login succesful", success: true, notes: user.notes });
    });
});

userRoutes.route("/").get(async (req, res) => {
  let db_connect = dbo.getDb();
  let token = req.cookies.token;
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      db_connect
        .collection('users')
        .findOne({ _id : new ObjectId(data.id)})
        .then(user => {
          if (user) {
            return res.json({ status: true, notes: user.notes });
          } else {
            return res.json({ status: false });
          }
      });
    }
  });
});

userRoutes.route("/update").post(async (req, res) => {
  let db_connect = dbo.getDb();
  let token = req.cookies.token;
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      let query = { _id: new ObjectId(data.id) };
      let newvalues = {
        $set: { 
          notes: req.body.notes,
        },
      }
      db_connect
        .collection('users')
        .updateOne(query, newvalues)
        .then(user => {
          if (user) {
            return res.json({ status: true });
          } else {
            return res.json({ status: false });
          }
      });
    }
  });
});
module.exports = userRoutes;  