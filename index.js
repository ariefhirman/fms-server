const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");

const service = require('./src/connection/conn');
const dbConfig = require("./src/config/db.config");

require("dotenv").config();
// const path = "mongodb+srv://username:password@ipaddress:port/dbname?retryWrites=true&w=majority";

var corsOptions = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  preflightContinue: true,
  maxAge: 600
};

function startServer() {
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

  // static serving for image
  app.use('/static', express.static('public'))

  // routing of each module
  require('./src/routes/auth.routes')(app);
  require('./src/routes/detection.routes')(app);
  require('./src/routes/mission.routes')(app);
  require('./src/routes/upload.routes')(app);

  // start RabbitMQ and Socket service
  service.startService(httpServer);

  // set port, listen for requests
  const PORT = process.env.PORT || 6868;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

startServer();