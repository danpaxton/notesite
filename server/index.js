const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createSecretToken } = require("./utils/secretToken");
const { UserModel } = require("./utils/connection");
const { ObjectId } =  require("mongodb");
require("dotenv").config({ path: "./config.env" });

app.use(cors());
app.use(express.json());

// Account routing
app.post("/signup", (req, res) => {
  let myquery = { username : req.body.username };
  UserModel
   .findOne(myquery)
   .then(async found => {
     if (found) {
       return res.json({ success: false, message: "User already exists" });
     }
     let newValues = {
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 12),
        notes: []
     };
    UserModel
      .create(newValues)
      .then(data => {
        const token = createSecretToken(data.insertedId);
        return res.json({ success: true, token });
      });
    });
  });

app.post("/login", (req, res) => {
  let { username, password } = req.body;
  UserModel
    .findOne({ username })
    .then(user => {
      if (!user) {
        return res.json({ success: false, message: 'Invalid credentials' });
      }
      const auth = bcrypt.compare(password, user.password);
      if (!auth) {
        return res.json({ success: false, message: 'Invalid credentials' });
      }
      const token = createSecretToken(user._id);
      return res.json({ success: true, notes: user.notes, token });
    });
});

// Data routing
app.post("/", (req, res) => {
  let token = req.body.token;
  jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      UserModel
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

app.post("/update", async (req, res) => {
  let token = req.body.token;
  jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      let query = { _id: new ObjectId(data.id) };
      let newValues = {
        $set: { 
          notes: req.body.notes,
        },
      }
      UserModel
        .updateOne(query, newValues)
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
// development
if (process.env.PORT) {
  app.listen(process.env.PORT);
}
module.exports = app;