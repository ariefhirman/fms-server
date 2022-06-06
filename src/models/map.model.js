const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const mapLayoutSchema = new Schema({
  mission_id: String,
  map_id: String,
  url: String
}, { id: false })

const MapLayout = mongoose.model(
  "MapLayout",
  mapLayoutSchema
);

module.exports = MapLayout;