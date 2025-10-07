const config = require('../config.json');
const mongoose = require('mongoose');

const express =require("express");
const http = require('http')
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // dein Next.js-Frontend
    credentials: true,
  },
});

// Auth-Middleware für Socket.io
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Unauthorized"));
  }

  // Du kannst hier gegen MongoDB oder JWT prüfen
  console.log("🔑 Authentifizierter Nutzer:", token);

  next();
});

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("login", async (data) => {
    console.log("📩 Login event received:", data);

    socket.emit("loginResponse", { success: true, user: { username: data.username } });
  });
});


server.listen(4000, () => console.log("🚀 Backend läuft auf Port 4000"));

var db = mongoose.connect(`${config.database.link}${config.database.user}:${config.database.password}@cluster0.2a0i2cd.mongodb.net/${config.database.repo}`).then(() => {
    console.log('Database connection established');
})

