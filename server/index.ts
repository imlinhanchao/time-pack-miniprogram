#!/usr/bin/env node

/**
 * Module dependencies.
 */

import fs from "fs";
import path from "path";

if (!fs.existsSync(path.join(__dirname, "config.json"))) {
  console.info(
    "[Info] Please execute `npm run init` to initialization config."
  );
  process.exit(0);
}

const { name } = require("./package.json");
const app = require("./app").default;
const http = require("http");
const config = require("./config.json");
const Task = require("./lib/task");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || config.port);
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string | number) {
  const port = parseInt(val.toString(), 10);

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

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

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
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr!.port;
  console.log(`${name}:server Listening on ${bind}`);
  Task.create(); // 启动定时任务
}
