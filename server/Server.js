const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createSecretToken } = require("./util/SecretToken");
const { ObjectId } =  require("mongodb");

//require("dotenv").config({ path: "./config.env" });
mongoose.connect(process.env.ATLAS_URI)

app.use(cors({
  origin: [
    "https://notesite-nu.vercel.app",
  ],
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Schemas
const noteSchema = new mongoose.Schema({
  text: String,
  pinned: Boolean,
  editedAt: Date
})

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  notes: [noteSchema]
})

const UserModel = mongoose.model("users", userSchema);

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
        res.cookie("token", createSecretToken(data.insertedId), {
          withCredentials: true,
          httpOnly: false,
        });
        return res.json({ success: true });
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
      res.cookie("token", createSecretToken(user._id), {
        withCredentials: true,
        httpOnly: false,
      });
      return res.json({ success: true, notes: user.notes });
    });
});

// Data routing
app.get("/", (req, res) => {
  let token = req.cookies.token;
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
  let token = req.cookies.token;
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

app.listen(3001, () => {
  console.log(`Server is running`);
});