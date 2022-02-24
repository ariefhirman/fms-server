const db = require("../models");
const Data = db.data;
const handler = require("../handler/detection.handler");

exports.findAll = (req, res) => {
  Data.find().lean()
    .then(data => {
        let parsedData = handler.parseDetectionData(data)
        res.send(parsedData);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

exports.findByMissionID = (req, res) => {  
    Data.find({ mission_id: req.body.mission_id })
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "Mission not found: " + req.body.mission_id
            });            
        }
        res.send(data);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Mission not found with mission id " + req.body.mission_id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Data with mission id " + req.body.mission_id
        });
    });
};

exports.findByRacks = (req, res) => {  
  Data.find({ rack_id: req.params.rack_id })
  .then(data => {
      if(!data) {
          return res.status(404).send({
              message: "Rack not found " + req.params.rack_id
          });            
      }
      res.send(data);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Rack not found with id " + req.params.rack_id
          });                
      }
      return res.status(500).send({
          message: "Error retrieving Rack with id " + req.params.rack_id
      });
  });
};

exports.findByStatus = (req, res) => {  
  Data.find({ status: req.params.status_detection })
  .then(data => {
      if(!data) {
          return res.status(404).send({
              message: "Not found: " + req.params.status
          });            
      }
      res.send(data);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Not found: " + req.params.status
          });                
      }
      return res.status(500).send({
          message: "Error retrieving data with status: " + req.params.status
      });
  });
};

exports.findByDate = (req, res) => {  
  Data.find({ date: req.params.date })
  .then(data => {
      if(!data) {
          return res.status(404).send({
              message: "Not found: " + req.params.date
          });            
      }
      res.send(data);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Not found: " + req.params.date
          });                
      }
      return res.status(500).send({
          message: "Error retrieving data with date: " + req.params.date
      });
  });
};

exports.deleteByRacks = (req, res) => {
  const id = req.body.rack_id;
  Data.deleteMany({ rack_id:id })
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
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const newData = new Data({
    id: req.body.id,
    mission_id: req.body.mission_id,
    rack_id: req.body.rack_id,
    date: req.body.date,
    status: req.body.status,
    product_detection: req.body.product_detection
  });

  // Save Data in the database
  newData
    .save(newData)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the detection data."
      });
    });
};