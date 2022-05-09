const amqp = require('amqplib/callback_api');
// Declare amqp connections
let amqpConn = null;
const MQ_URL = `amqp://localhost`;

module.exports = {
    InitConnection: (fnFinish) => {
        // Start connection with Rabbitmq
        amqp.connect(MQ_URL, (err, conn) => {
            // If connection error
            if (err) {
                console.error("[AMQP]", err.message);
                return setTimeout(this, 1000);
            }
            conn.on("error", function(err) {
                console.log("ERROR", err);
                if (err.message !== "Connection closing") {
                    console.error("[AMQP] conn error", err.message);
                }
            });
            conn.on("close", function() {
                // Reconnect when connection was closed
                console.error("[AMQP] reconnecting");
                return setTimeout(() => { module.exports.InitConnection(fnFinish) }, 1000);
            });
            // Connection OK
            console.log("[AMQP] connected");
            amqpConn = conn;
            // Execute finish function
            fnFinish();
        });
    },
    StartConsumerDirect: (getDroneConsumer, exchange) => {
        // Create a channel for queue
        amqpConn.createChannel(function(err, ch) {
            if (closeOnErr(err)) return;

            ch.on("error", function(err) {
                console.error("[AMQP] channel error", err.message);
            });

            ch.on("close", function() {
                console.log("[AMQP] channel closed");
            });

            // Set prefetch value
            ch.prefetch(10);
            ch.assertExchange(exchange, "direct", {
                durable: false
            });
            ch.assertQueue("drone_name", { durable: true }, function(err, q) {
                if (closeOnErr(err)) return;
                // Consume incoming messages
                ch.bindQueue("drone_name", exchange, "drone_name");
                ch.consume("drone_name", processMsg, { noAck: false });
                console.log("[AMQP] Worker is started");
            });
            function processMsg(msg) {
                // Process incoming messages and send them to fnConsumer
                // Here we need to send a callback(true) for acknowledge the message or callback(false) for reject them
                console.log(msg.content.toString());
                getDroneConsumer(msg, function(ok) {
                    try {
                        ok ? ch.ack(msg) : ch.reject(msg, true);
                    } catch (e) {
                        closeOnErr(e);
                    }
                });
            }
        });
    },
    StartConsumer: (queue, fnConsumer, io, socketChannel, exchange) => {
        // Create a channel for queue
        amqpConn.createChannel(function(err, ch) {
            if (closeOnErr(err)) return;

            ch.on("error", function(err) {
                console.error("[AMQP] channel error", err.message);
            });

            ch.on("close", function() {
                console.log("[AMQP] channel closed");
            });

            // Set prefetch value
            ch.prefetch(10);
            ch.assertExchange(exchange, 'topic', {
                durable: false
            });
            ch.assertQueue(queue, { durable: true }, function(err, _ok) {
                if (closeOnErr(err)) return;
                // Consume incoming messages
                channel.bindQueue(queue, exchange, key);
                ch.consume(queue, processMsg, { noAck: false });
                // socket.emit("message", processMsg);
                console.log("[AMQP] Worker is started");
            });
            function processMsg(msg) {
                // Process incoming messages and send them to fnConsumer
                // Here we need to send a callback(true) for acknowledge the message or callback(false) for reject them
                console.log(msg.content.toString());
                io.emit(socketChannel, msg.content.toString());
                fnConsumer(msg, function(ok) {
                    try {
                        ok ? ch.ack(msg) : ch.reject(msg, true);
                    } catch (e) {
                        closeOnErr(e);
                    }
                });
            }
        });
    },
    StartPublisher: () => {
      // Init publisher
      amqpConn.createConfirmChannel(function(err, ch) {
          if (closeOnErr(err)) return;

          ch.on("error", function(err) {
              console.error("[AMQP] channel error", err.message);
          });

          ch.on("close", function() {
              console.log("[AMQP] channel closed");
          });

          // Set publisher channel in a var
          pubChannel = ch;
          console.log("[AMQP] Publisher started");
      });
    },
    PublishMessageV2: (exchange, key, content, options = {}) => {
        // Verify if pubchannel is started
        if (!pubChannel) {
            console.error("[AMQP] Can't publish message. Publisher is not initialized. You need to initialize them with StartPublisher function");
            return;
        }
        // convert string message in buffer
        const message = Buffer.from(content, "utf-8");
        pubChannel.assertExchange(exchange, 'topic', {
            durable: false
        });
        pubChannel.publish(exchange, key, message);
        console.log("[AMQP] Worker is started");
        console.log("[AMQP] message delivered");
        // pubChannel.assertQueue(queue, { durable: true }, function(err, _ok) {
        //     if (closeOnErr(err)) return;
        //     // Consume incoming messages
        //     pubChannel.sendToQueue(queue, message, options);
        //     console.log("[AMQP] Worker is started");
        //     console.log("[AMQP] message delivered");
        // });
    },
    PublishMessage: (queue, content, options = {}) => {
        // Verify if pubchannel is started
        if (!pubChannel) {
            console.error("[AMQP] Can't publish message. Publisher is not initialized. You need to initialize them with StartPublisher function");
            return;
        }
        // convert string message in buffer
        const message = Buffer.from(content, "utf-8");
        pubChannel.assertExchange(exchange, 'topic', {
            durable: false
        });
        pubChannel.publish(exchange, key, message);
        console.log("[AMQP] Worker is started");
        console.log("[AMQP] message delivered");
        // pubChannel.assertQueue(queue, { durable: true }, function(err, _ok) {
        //     if (closeOnErr(err)) return;
        //     // Consume incoming messages
        //     pubChannel.sendToQueue(queue, message, options);
        //     console.log("[AMQP] Worker is started");
        //     console.log("[AMQP] message delivered");
        // });
    }
};

function closeOnErr(err) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    amqpConn.close();
    return true;
}