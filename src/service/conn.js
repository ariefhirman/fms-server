const rabbitmqLib = require('./mq/mqService');
const queue = require('./mq/topicMq')

var socketChan = null

function fnConsumer(msg, callback) {
    let message = msg.content.toString();
    console.log("Received message: ", message);
    socket.emit("test", () => 
      console.info(`Socket says: "${message}"`)
    );
    callback(true);
}

const startService = (socket) => {
  socketChan = socket;
  rabbitmqLib.InitConnection(() => {
    rabbitmqLib.StartConsumer("test", fnConsumer);
    rabbitmqLib.StartPublisher();
  });
}

module.exports = {
  startService
};

// We wait 1 seconds after send a message to queue
// example of publish
// setTimeout(() => {
//     rabbitmqLib.PublishMessage("test-queue", "hasyu",);
// }, 1000);