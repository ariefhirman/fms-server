const db = require("../models");
const Data = db.data;
const utils = require("../utils/detection.utils");
const logger = require("../logger/logger");

exports.findAll = (req, res) => {
  Data.find().lean()
    .then(data => {
        logger.info("[FindAll][Detection] Detection found")
        let parsedData = utils.parseDetectionData(data)
        res.send(parsedData);
    }).catch(err => {
        logger.error("[FindAll][Detection] Detection data not found")
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

exports.findByMissionID = (req, res) => {  
    Data.find({ mission_id: req.params.mission_id })
    .then(data => {
        if(!data) {
            logger.error("[FindByMissionID][Detection] Detection not found")
            return res.status(404).send({
                message: "Mission not found: " + req.body.mission_id
            });            
        }
        logger.info("[FindByMissionID][Detection] Detection found")
        res.send(data);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            logger.error("[FindByMissionID][Detection] Detection not found")
            return res.status(404).send({
                message: "Mission not found with mission id " + req.body.mission_id
            });                
        }
        logger.error("[FindByMissionID][Detection] Detection not found")
        return res.status(500).send({
            message: "Error retrieving Data with mission id " + req.body.mission_id
        });
    });
};

exports.findByLocations = (req, res) => {  
  Data.find({ rack_id: req.params.location_id })
  .then(data => {
      if(!data) {
        logger.error("[FindByLocations][Detection] Detection not found")
          return res.status(404).send({
              message: "Rack not found " + req.params.location_id
          });            
      }
      logger.info("[FindByLocations][Detection] Detection found")
      res.send(data);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
        logger.error("[FindByLocations][Detection] Detection not found with id " + req.params.location_id)
        return res.status(404).send({
          message: "Rack not found with id " + req.params.location_id
        });                
      }
      logger.error("[FindByLocations][Detection] Detection not found")
      return res.status(500).send({
          message: "Error retrieving Rack with id " + req.params.location_id
      });
  });
};

exports.findByStatus = (req, res) => {  
  Data.find({ status: req.params.status_detection })
  .then(data => {
      if(!data) {
        logger.error("[FindByStatus][Detection] Detection not found with status: " + req.params.status_detection)
          return res.status(404).send({
              message: "Not found: " + req.params.status_detection
          });            
      }
      logger.info("[FindByStatus][Detection] Detection found")
      res.send(data);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
        logger.error("[FindByStatus][Detection] Detection not found")
          return res.status(404).send({
              message: "Not found: " + req.params.status_detection
          });                
      }
      logger.error("[FindByStatus][Detection] Detection not found")
      return res.status(500).send({
          message: "Error retrieving data with status: " + req.params.status_detection
      });
  });
};

exports.findByDate = (req, res) => {  
  Data.find({ date: req.params.date })
  .then(data => {
      if(!data) {
        logger.error("[FindByDate][Detection] Detection not found with date: " + req.params.date)
          return res.status(404).send({
              message: "Not found: " + req.params.date
          });            
      }
      logger.info("[FindByDate][Detection] Detection found")
      res.send(data);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
        logger.error("[FindByDate][Detection] Detection not found")
          return res.status(404).send({
              message: "Not found: " + req.params.date
          });                
      }
      logger.error("[FindByDate][Detection] Detection not found")
      return res.status(500).send({
          message: "Error retrieving data with date: " + req.params.date
      });
  });
};

exports.deleteByLocation = (req, res) => {
  const id = req.body.location_id;
  Data.deleteMany({ location_id:id })
    .then(data => {
    if (!data) {
        res.status(404).send({
        message: `Cannot delete data with rack id=${id}`
        });
    } else {
        res.send({
        message: "Data was deleted successfully!"
        });
    }
    })
    .catch(err => {
    res.status(500).send({
        message: "Could not delete data with rack id = " + id
    });
  });
};

exports.deleteAllData = (req, res) => {
  Data.deleteMany()
    .then(data => {
    if (!data) {
        res.status(404).send({
        message: `Cannot delete data`
        });
    } else {
        res.send({
          message: "All data was deleted successfully!"
        });
    }
    })
    .catch(err => {
    res.status(500).send({
        message: "Could not delete data"
    });
  });
};

exports.create = (req, res) => {
  if (!req.body.id) {
    logger.error("[Create][Detection] Can't create detection with empty ID")
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const newData = new Data({
    id: req.body.id,
    mission_id: req.body.mission_id,
    location_id: req.body.location_id,
    date: req.body.date,
    status: req.body.status,
    product_detection: req.body.product_detection
  });

  // Save Data in the database
  newData
    .save(newData)
    .then(data => {
        logger.error("[Create][Detection] Success create data")
        res.send(data);
    })
    .catch(err => {
        logger.error("[Create][Detection] Unable to create data")
        res.status(500).send({
            message: err.message || "Some error occurred while creating the detection data."
        });
    });
};