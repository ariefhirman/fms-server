const rabbitmqLib = require('./mq/mqService');
const key = require('./mq/routingKey');
const channel = require('./socket/socketChannel');
const logger = require("../logger/logger");
const axios = require("axios");

let listDrone = ["drone1", "drone2"]
let activeConnection = []

const startService = (httpServer) => {
  const io = require('socket.io')(httpServer, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      transports: ['websocket', 'polling'],
      credentials: true
    },
    allowEIO3: true
  });

  rabbitmqLib.InitConnection((connection) => {
    console.log(connection);
    rabbitmqLib.StartPublisher();
    io.on('connection', (socket) => {
      console.log("started");
      logger.info("[WebSocket][Connection] Success initiate connection")
      // NOTE: GET DRONE DISCOVERY -> DEPRECATED
      // socket.on("discover-drone", () => {
      //   rabbitmqLib.PublishMessageFanout("new_connection", "", "get_drone")
      // })

      // NOTE: OLD MECHANISM TO GET LIST DRONE, DOESN'T GET COMMENTED
      // STILL NEED THE FLOW AND CODE TO CREATE CONSUMER DYNAMICALLY
      socket.on("discovery", (msg) => {
        // discovery command from FE to create consumer dynamically
        if (msg.toString() === "True" || msg.toString() === "true") {
          for (let i=0; i<listDrone.length; i++) {
            let queueStatus = listDrone[i] + '_status'
            let keyStatusAll = listDrone[i] + key.status.all
            let keyStatusConnection = listDrone[i] + key.status.connection
            let keyStatusBattery = listDrone[i] + key.status.battery_percentage
            let keyStatusArmed = listDrone[i] + key.status.armed
            let keyStatusMode = listDrone[i] + key.status.mode
            let keyStatusAltitude = listDrone[i] + key.status.altitude
            let keyStatusSpeed = listDrone[i] + key.status.speed
  
            rabbitmqLib.StartConsumer(queueStatus,keyStatusAll, fnConsumer, io, listDrone[i] + channel.status.all, "status")
            rabbitmqLib.StartConsumer(queueStatus,keyStatusConnection, fnConsumer, io, listDrone[i] + channel.status.connection, "status")
            rabbitmqLib.StartConsumer(queueStatus,keyStatusBattery, fnConsumer, io, listDrone[i] + channel.status.battery_percentage, "status")
            rabbitmqLib.StartConsumer(queueStatus,keyStatusArmed, fnConsumer, io, listDrone[i] + channel.status.armed, "status")
            rabbitmqLib.StartConsumer(queueStatus,keyStatusMode, fnConsumer, io, listDrone[i] + channel.status.mode, "status")
            rabbitmqLib.StartConsumer(queueStatus,keyStatusAltitude, fnConsumer, io, listDrone[i] + channel.status.altitude, "status")
            rabbitmqLib.StartConsumer(queueStatus,keyStatusSpeed, fnConsumer, io, listDrone[i] + channel.status.speed, "status")
  
            // listener
            socket.on(listDrone[i] + channel.command.start, (msg) => {
              rabbitmqLib.PublishMessageV2("operation", listDrone[i] + key.command.start, msg.toString());
            })
  
            // listener
            socket.on(listDrone[i] + channel.command.pause, (msg) => {
              rabbitmqLib.PublishMessageV2("operation", listDrone[i] + key.command.pause, msg.toString());
            })
  
            // listener
            socket.on(listDrone[i] + channel.command.restart, (msg) => {
              rabbitmqLib.PublishMessageV2("operation", listDrone[i] + key.command.restart, msg.toString());
            })
  
            // listener
            socket.on(listDrone[i] + channel.command.shutdown, (msg) => {
              rabbitmqLib.PublishMessageV2("operation", listDrone[i] + key.command.shutdown, msg.toString());
            })

            // listener
            socket.on(listDrone[i] + channel.command.rth, (msg) => {
              rabbitmqLib.PublishMessageV2("operation", listDrone[i] + key.command.rth, msg.toString());
            })

            socket.emit("discovery:drone", listDrone[i])
          }
        }
      })

      // NOTE: GET LIST OF DRONE FROM RABBITMQ CONSUMER
      socket.on("discovery", () => {
        let listActive = []
        axios.get('http://localhost:15672/api/consumers', {
          auth: {
            username: "guest",
            password: "guest"
          }
        })
        .then(resp => {
          // console.log(resp);
          console.log(resp.data);
        }).catch((err) => {
          console.log(err);
        });
      })

    });

    io.on('connect_error', (err) => {
      logger.error(`[WebSocket][ConnectError] Error connection with ${err.message}`)
    });
  });
}

// logging purpose
function fnConsumer(msg, callback) {
  let message = msg.content.toString();
  console.log("Received message: ", message);
  callback(true);
}

// get drone name and amount
function getDroneConsumer(msg, callback) {
  let drone_name = msg.content.toString();
  if (!listDrone.includes(drone_name)) {
    listDrone.push(drone_name)
  }
  console.log(listDrone)
  callback(true) 
}

// NOTE: PARSING DRONE ID FROM CONSUMER TAGS IN RABBITMQ
// NOT FINISHED, CHANGING TO DDS
function parseConsumerToArray(arrObj, identifier) {
  if (arrObj.length == 0) {
    return []
  }

  let listActive = []
  for (data in arrObj) {
    if (data.consumer_tag[0] == identifier) {
      // listActive.push()
      let identity = 
      console.log(data.consumer_tag[2:])
    }
  }
}

module.exports = {
  startService
};