const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const logger = require("../logger/logger");
// const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    name: req.body.name,
    appKey: req.body.appKey,
    contact: req.body.contact
  });

  if (req.body.username == "" || req.body.password == "") {
    logger.error("[Signup] Error username and password is empty")
    res.status(500).send({ message: "Username and password must not be empty" });
  }

  // if (req.body.name == "") {
    // res.status(500).send({ message: "Please insert your name" });
  // }

  user.save((err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    res.send({ message: "User was registered successfully!" });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    // .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        contact: user.contact,
        appKey: user.appKey,
        accessToken: token
      });
    });
};