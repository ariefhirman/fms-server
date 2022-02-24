const controller = require("../controllers/mission.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // post mission config
  app.post("/api/v1/config",controller.create);
  // get all data
  app.get("/api/v1/config", controller.findAll)
  // get the latest config
  app.get("/api/v1/config/latest", controller.findLatest)
  // get several latest config
  app.get("/api/v1/config/latest/:no", controller.findLatestByParam)
  // get config based on mission ID
  app.get("/api/v1/config/:id", controller.findByID)
  // delete all data
  app.delete("/api/v1/config", controller.deleteAllData)
};