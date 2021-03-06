const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const app = express();
app.use(bodyParser.json());
app.use(cors());

//opens server on port in local environment
app.listen(process.env.PORT || 3001, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt, salt)
);

app.post("/signin", signin.handleSignin(db, bcrypt));

app.get("/", (req, res) => {
  res.send("It is working");
});
