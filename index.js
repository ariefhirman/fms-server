const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./src/config/db.config");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require('fs-extra');
require("dotenv").config();
// const path = "mongodb+srv://username:password@ipaddress:port/dbname?retryWrites=true&w=majority";

var corsOptions = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  preflightContinue: true,
  maxAge: 600
};
app.options('*', cors(corsOptions));

app.use(express.static('public'))
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./src/models");

// db.mongoose
//   .connect(path, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log("Successfully connect to MongoDB.");
//     initial();
//   })
//   .catch(err => {
//     console.error("Connection error", err);
//     process.exit();
//   });

db.mongoose
.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Successfully connect to MongoDB.");
})
.catch(err => {
  console.error("Connection error", err);
  process.exit();
});

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

app.post('/api/v1/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false
    });

  } else {
    let date = getDateNow();
    var fileName = req.file.filename;
    const filesDir = './public/images/' + req.body.racks + '/' + date;
    // console.log('file received');
    
    if (fs.existsSync(filesDir + '/' + fileName)) {
      fs.unlink(filesDir + '/' + fileName, (err) => {
          if (err) {
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
            return console.error(err);
        }
    });
    return res.send({
      success: true
    })
  }
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Testing for User JWT API." });
});

app.use('/static', express.static('public'))

require('./src/routes/auth.routes')(app);
require('./src/routes/detection.routes')(app);
require('./src/routes/mission.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 6868;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

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