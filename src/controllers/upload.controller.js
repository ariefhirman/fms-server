const fs = require('fs-extra');
const logger = require("../logger/logger");
const utils = require("../utils/upload.utils");
const db = require("../models");
const Layout = db.layout;
require("dotenv").config();

exports.upload = (req, res) => {
  if (!req.file) {
    console.log("No file received");
    logger.error("[UploadFile] Error upload file")
    return res.send({
      success: false
    });

  } else {
    let date = utils.getDateNow();
    var fileName = req.file.filename;
    const filesDir = './public/images/' + req.body.racks + '/' + date;
    if (fs.existsSync(filesDir + '/' + fileName)) {
      fs.unlink(filesDir + '/' + fileName, (err) => {
          if (err) {
              logger.error("[UploadFile] Error unlnk file")
              console.log(err);
              return res.send({
                success: false,
                error: err
              })
          }
          // console.log('deleted');
      })
    }
    
    fs.move('./uploads/' + fileName, filesDir + '/' + fileName, function (err) {
        if (err) {
          logger.error("[UploadFile] Error moving file into main directory")
            return console.error(err);
        }
    });
    logger.info("[UploadFile] Upload file successfull")
    return res.send({
      success: true
    })
  }
}

exports.uploadMap = (req, res) => {
  if (!req.file) {
    console.log("No file received");
    logger.error("[UploadMap] Error upload file")
    return res.send({
      success: false
    });

  } else {
    const PORT = process.env.PORT
    let mission_id = req.body.mission_id;
    let map_id = req.body.map_id;
    var fileName = req.file.filename;
    let date = utils.getDateNow();
    let url = 'http://localhost:' + PORT + '/static/images/map/' + mission_id + '/' + map_id + '/' + fileName;
    const filesDir = './public/images/map/'+ mission_id + '/' + map_id;

    if (fs.existsSync(filesDir + '/' + fileName)) {
      fs.unlink(filesDir + '/' + fileName, (err) => {
          if (err) {
              logger.error("[UploadFile] Error unlnk file")
              console.log(err);
              return res.send({
                success: false,
                error: err
              })
          }
          // console.log('deleted');
      })
    }
    
    fs.move('./uploads/' + fileName, filesDir + '/' + fileName, function (err) {
        if (err) {
          logger.error("[UploadFile] Error moving file into main directory")
            return console.error(err);
        }
    });
    logger.info("[UploadFile] Upload file successfull")
    
    newLayout = new Layout({
      mission_id: mission_id,
      map_id: map_id,
      url: url
    });

    newLayout
    .save(newLayout)
    .then(data => {
      logger.info("[UploadMap] Create map layout record")
      res.send({
        success: true
      });
    })
    .catch(err => {
      logger.error("[UploadMap] Error creating map layout record")
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating map record."
      });
    });
  }
}