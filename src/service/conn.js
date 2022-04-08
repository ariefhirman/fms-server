const rabbitmqLib = require('./mq/mqService');
const key = require('./mq/routingKey');
const queue = require('./mq/queueMq');
const channel = require('./socket/socketChannel');
const config = require('../controllers/mission.controller');

let listDrone = ["drone1", "drone2"]
let isDroneAmountInitialized = false

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
  // listDrone.push(drone_name)
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
      // get drone discovery
      rabbitmqLib.StartConsumerDirect(getDroneConsumer, "operations");

      socket.on("discovery", (msg) => {
        console.log(listDrone)
        console.log(msg.toString())
        if (msg.toString() === "True" || msg.toString() === "true") {
          // isDroneAmountInitialized = true
          // console.log(isDroneAmountInitialized)
          // if (isDroneAmountInitialized) {
            // console.log("initialized")
            // if (listDrone.length == config.droneAmount) {
              for (let i=0; i<listDrone.length; i++) {
                let keyStatusAll = listDrone[i] + key.status.all
                let keyStatusConnection = listDrone[i] + key.status.connection
                let keyStatusBattery = listDrone[i] + key.status.battery_percentage
                let keyStatusArmed = listDrone[i] + key.status.armed
                let keyStatusMode = listDrone[i] + key.status.mode
                let keyStatusAltitude = listDrone[i] + key.status.altitude
                let keyStatusSpeed = listDrone[i] + key.status.speed
      
                rabbitmqLib.StartConsumer(keyStatusAll, fnConsumer, io, "status", "status")
                rabbitmqLib.StartConsumer(keyStatusConnection, fnConsumer, io, "status", "status")
                rabbitmqLib.StartConsumer(keyStatusBattery, fnConsumer, io, "status", "status")
                rabbitmqLib.StartConsumer(keyStatusArmed, fnConsumer, io, "status", "status")
                rabbitmqLib.StartConsumer(keyStatusMode, fnConsumer, io, "status", "status")
                rabbitmqLib.StartConsumer(keyStatusAltitude, fnConsumer, io, "status", "status")
                rabbitmqLib.StartConsumer(keyStatusSpeed, fnConsumer, io, "status", "status")
      
                socket.on(listDrone[i] + channel.command.start, (msg) => {
                  rabbitmqLib.PublishMessageV2("command", listDrone[i] + key.command.start, msg.toString());
                })
      
                socket.on(listDrone[i] + channel.command.pause, (msg) => {
                  rabbitmqLib.PublishMessageV2("command", listDrone[i] + key.command.pause, msg.toString());
                })
      
                socket.on(listDrone[i] + channel.command.restart, (msg) => {
                  rabbitmqLib.PublishMessageV2("command", listDrone[i] + key.command.restart, msg.toString());
                })
      
                socket.on(listDrone[i] + channel.command.shutdown, (msg) => {
                  rabbitmqLib.PublishMessageV2("command", listDrone[i] + key.command.shutdown, msg.toString());
                })
    
                socket.on(listDrone[i] + channel.command.rth, (msg) => {
                  rabbitmqLib.PublishMessageV2("command", listDrone[i] + key.command.rth, msg.toString());
                })

                socket.emit("discovery:drone", listDrone[i])
              // }
            }
    
            isDroneAmountInitialized = false
          // }
        }
      })
      // console.log(isDroneAmountInitialized)

      // if (isDroneAmountInitialized) {
      //   console.log("initialized")
      //   // if (listDrone.length == config.droneAmount) {
      //     for (let i=0; i<listDrone.length; i++) {
      //       let keyStatusAll = listDrone[i] + key.status.all
      //       let keyStatusConnection = listDrone[i] + key.status.connection
      //       let keyStatusBattery = listDrone[i] + key.status.battery_percentage
      //       let keyStatusArmed = listDrone[i] + key.status.armed
      //       let keyStatusMode = listDrone[i] + key.status.mode
      //       let keyStatusAltitude = listDrone[i] + key.status.altitude
      //       let keyStatusSpeed = listDrone[i] + key.status.speed
  
      //       rabbitmqLib.StartConsumer(keyStatusAll, fnConsumer, io, "status")
      //       rabbitmqLib.StartConsumer(keyStatusConnection, fnConsumer, io, "status")
      //       rabbitmqLib.StartConsumer(keyStatusBattery, fnConsumer, io, "status")
      //       rabbitmqLib.StartConsumer(keyStatusArmed, fnConsumer, io, "status")
      //       rabbitmqLib.StartConsumer(keyStatusMode, fnConsumer, io, "status")
      //       rabbitmqLib.StartConsumer(keyStatusAltitude, fnConsumer, io, "status")
      //       rabbitmqLib.StartConsumer(keyStatusSpeed, fnConsumer, io, "status")
  
      //       socket.on(listDrone[i] + channel.command.start, (msg) => {
      //         rabbitmqLib.PublishMessageV2("command", listDrone[i] + key.command.start, msg.toString());
      //       })
  
      //       socket.on(listDrone[i] + channel.command.pause, (msg) => {
      //         rabbitmqLib.PublishMessageV2("command", listDrone[i] + key.command.pause, msg.toString());
      //       })
  
      //       socket.on(listDrone[i] + channel.command.restart, (msg) => {
      //         rabbitmqLib.PublishMessageV2("command", listDrone[i] + key.command.restart, msg.toString());
      //       })
  
      //       socket.on(listDrone[i] + channel.command.shutdown, (msg) => {
      //         rabbitmqLib.PublishMessageV2("command", listDrone[i] + key.command.shutdown, msg.toString());
      //       })

      //       socket.on(listDrone[i] + channel.command.rth, (msg) => {
      //         rabbitmqLib.PublishMessageV2("command", listDrone[i] + key.command.rth, msg.toString());
      //       })
      //     // }
      //   }

      //   isDroneAmountInitialized = false
      // }      

      // rabbitmqLib.StartConsumer("test", fnConsumer, io, channel.channelStart);
      // // Consumer
      // // rabbitmqLib.StartConsumer("test", fnConsumer, io, "message");
      // rabbitmqLib.StartConsumer("test", fnConsumer, io, channel.channelStart, "test");
      // rabbitmqLib.StartConsumer("test", fnConsumer, io, channel.channelStop);
      // rabbitmqLib.StartConsumer("test", fnConsumer, io, channel.channelRestart);
      
      // publish
      // socket.on("message", () => {
      //   rabbitmqLib.PublishMessage("test-1", "test",);
      // });
      // socket.on("test", (msg) => {
      //   // console.log(msg)
      //   rabbitmqLib.PublishMessage("test-2", msg.toString());
      // });
    });
  });
}

module.exports = {
  startService
};