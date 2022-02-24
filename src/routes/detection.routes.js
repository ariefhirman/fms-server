const controller = require("../controllers/detection.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // post data detection from CV model
  app.post("/api/v1/detection",controller.create);
  
  // get all data
  app.get("/api/v1/detection", controller.findAll)
  // get data by missionID
  app.get("/api/v1/detection/mission", controller.findByMissionID)
  // get data based on rack
  app.get("/api/v1/detection/racks/:rack_id", controller.findByRacks)
  // get data based on date
  app.get("/api/v1/detection/dates/:date", controller.findByDate)
  // get data based on status
  app.get("/api/v1/detection/status/:status_detection", controller.findByStatus)
  // delete data based on racks
  app.delete("/api/v1/detection/racks", controller.deleteByRacks)
  // get all data
  app.delete("/api/v1/detection", controller.deleteAllData)
};