const controller = require("../controllers/upload.controller");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
    // + path.extname(file.originalname)
  }
});

var upload = multer({ 
  storage: storage
})

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Upload image detection
  app.post('/api/v1/upload', upload.single('file') ,controller.upload);
};