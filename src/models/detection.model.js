const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const prod_detection = new Schema({
  product_code: String,
  url: String
}, { id: false }
)

const detectionSchema = new Schema({
  id: String,
  mission_id: String,
  rack_id: String,
  date: String,
  status: Number,
  product_detection: [prod_detection]
})

const Detection = mongoose.model(
  "Detection",
  detectionSchema
);

module.exports = Detection;