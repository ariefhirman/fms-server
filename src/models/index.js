const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.data = require("./detection.model");
db.config = require("./mission.model");
db.layout = require("./map.model");

module.exports = db;