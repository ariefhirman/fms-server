const fs = require('fs-extra');
const logger = require("../logger/logger");

function getDateNow() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth()+1; 
  let yyyy = today.getFullYear();
  
  if(dd<10) 
  {
      dd='0'+dd;
  } 

  if(mm<10) 
  {
      mm='0'+mm;
  }

  return dd + '-' + mm + '-' + yyyy
}

exports.upload = (req, res) => {
  if (!req.file) {
    console.log("No file received");
    logger.error("[UploadFile] Error upload file")
    return res.send({
      success: false
    });

  } else {
    let date = getDateNow();
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