#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require("../app");
var debug = require("debug")("generator:server");
var http = require("http");
var mongoose = require("mongoose");
const { WebSocketServer } = require("ws");

/**
 * Get port from environment and store in Express.
 */

var URL_DATABASE = "mongodb://localhost:27017";

var port = normalizePort(process.env.PORT || "80");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
const websocket = new WebSocketServer({ server: server, clientTracking: true });

mongoose
  .connect(`${URL_DATABASE}/pet_shop`)
  .then(() => console.log(`Conneted ${URL_DATABASE}`))
  .catch((err) => console.log(err));

/**
 * Listen on provided port, on all network interfaces.
 */
const idReceiver = "67172b1e05373a1bb6c1542e";
const clients = {};

websocket.on("connection", function connection(ws) {
  ws.on("error", console.error);
  console.log("user connected");
  clients[idReceiver] = ws;

  ws.on("message", function message(data) {
    const json = data.toString("utf8");
    websocket.clients.forEach((client) => {
      client.send(json);
    });
  });

  ws.on("close", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => console.log("Running"));
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}