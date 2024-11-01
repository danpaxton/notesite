const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT;
app.use(cors({
  origin: [
    "https://notesite-nu.vercel.app/",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(require("./routes/user"));
// get driver connection
const dbo = require("./db/conn");
app.listen(port, async () => {
  // perform a database connection when server starts
  await dbo.connectToServer(function (err) {
    if (err) console.error(err);
   });
  console.log(`Server is running on port: ${port}`);
});