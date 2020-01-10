const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("../routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", socket => {
  const log = messages => {
    const logs = ["Message from server:", ...messages];
    socket.emit("log", logs);
  };

  socket.on("create or join", room => {
    // log("Received request to create or join room " + room);
    const clientsInRoom = io.sockets.adapter.rooms[room];
    console.log("io.sockets.adapter.rooms", io.sockets.adapter.rooms);
    console.log(`clientsInRoom ${room}`, clientsInRoom);
    const numClients = clientsInRoom
      ? Object.keys(clientsInRoom.sockets).length
      : 0;
    log("Room " + room + " now has " + numClients + " client(s)");

    if (numClients === 0) {
      socket.join(room);
      // log("Client ID " + socket.id + " created room " + room);
      socket.emit("created", room, socket.id);
    } else if (numClients > 0 && numClients < 4) {
      // log("Client ID " + socket.id + " joined room " + room);
      io.in(room).emit("join", room);
      socket.join(room);
      socket.emit("joined", room, socket.id);
      io.in(room).emit("ready");
    } else {
      // reach max clients
      socket.emit("full", room);
    }
  });

  socket.on("message", (room, message) => {
    console.log(`${room} got message`, message);
    // log("Client said: " + message);
    socket.to(room).emit("message", message);
  });

  socket.on("ipaddr", () => {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === "IPv4" && details.address !== "127.0.0.1") {
          socket.emit("ipaddr", details.address);
        }
      });
    }
  });

  socket.on("leave", room => {
    console.log(`leaving room ${room}`);
    socket.leave(room);
  });

  socket.on("disconnect", () => {
    // log("Disconnect roi hu hu");
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
