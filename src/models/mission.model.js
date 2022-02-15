const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const rackSize = new Schema({
  width: Number,
  level_height: [Number]
}, { id: false }
)

const missionConfigSchema = new Schema({
  id: String,
  mission_name: String,
  drone_name: String,
  start_point: Number,
  end_point: Number,
  mission_speed: Number,
  max_altitude: Number,
  min_altitude: Number,
  rack_ids: [String],
  orientation: String,
  sweep_config: [Number],
  rack_size: [rackSize]
}, { id: false })

const MissionConfig = mongoose.model(
  "Mission",
  missionConfigSchema
);

module.exports = MissionConfig;