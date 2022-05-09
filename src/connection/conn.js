const rabbitmqLib = require('./mq/mqService');
const key = require('./mq/routingKey');
const queue = require('./mq/queueMq');
const channel = require('./socket/socketChannel');

let listDrone = ["drone1", "drone2"]

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

  rabbitmqLib.InitConnection(() => {
    rabbitmqLib.StartPublisher();
    io.on('connection', (socket) => {
      console.log("started");
      logger.info("[WebSocket][Connection] Success initiate connection")
      // get drone discovery
      rabbitmqLib.StartConsumerDirect(getDroneConsumer, "operations");

      socket.on("discovery", (msg) => {
        // discovery command from FE to create consumer dynamically
        if (msg.toString() === "True" || msg.toString() === "true") {
          for (let i=0; i<listDrone.length; i++) {
            let keyStatusAll = listDrone[i] + key.status.all
            let keyStatusConnection = listDrone[i] + key.status.connection
            let keyStatusBattery = listDrone[i] + key.status.battery_percentage
            let keyStatusArmed = listDrone[i] + key.status.armed
            let keyStatusMode = listDrone[i] + key.status.mode
            let keyStatusAltitude = listDrone[i] + key.status.altitude
            let keyStatusSpeed = listDrone[i] + key.status.speed
  
            rabbitmqLib.StartConsumer(keyStatusAll, fnConsumer, io, listDrone[i] + channel.status.all, "status")
            rabbitmqLib.StartConsumer(keyStatusConnection, fnConsumer, io, listDrone[i] + channel.status.connection, "status")
            rabbitmqLib.StartConsumer(keyStatusBattery, fnConsumer, io, listDrone[i] + channel.status.battery_percentage, "status")
            rabbitmqLib.StartConsumer(keyStatusArmed, fnConsumer, io, listDrone[i] + channel.status.armed, "status")
            rabbitmqLib.StartConsumer(keyStatusMode, fnConsumer, io, listDrone[i] + channel.status.mode, "status")
            rabbitmqLib.StartConsumer(keyStatusAltitude, fnConsumer, io, listDrone[i] + channel.status.altitude, "status")
            rabbitmqLib.StartConsumer(keyStatusSpeed, fnConsumer, io, listDrone[i] + channel.status.speed, "status")
  
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
    });

    io.on('connect_error', (err) => {
      logger.error(`[WebSocket][ConnectError] Error connection with ${err.message}`)
    });
  });
}

module.exports = {
  startService
};