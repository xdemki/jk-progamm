const config = require("../config.json");
const mongoose = require("mongoose");

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require('body-parser')

// Database
const Users = require("./schemas/Users");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Auth-Middleware für Socket.io
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) {
//     return next(new Error("Unauthorized"));
//   }

//   // Du kannst hier gegen MongoDB oder JWT prüfen
//   console.log("🔑 Authentifizierter Nutzer:", token);

//   next();
// });

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.onAny((event, ...args) => {
    console.log("Received event:", event, args);
  });

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/login', async(req, res) => {
  try {
    const findUser = await Users.findOne({ username: req.body.username });

    if(findUser) {
      if(req.body.password == findUser.password) {
        res.send({ success: true, message: 'login worked', body: findUser})
      } else {
        res.send({ success: false, message: 'wrong password', body: {} });
      }
    } else {
      res.send({ success: false, message: 'User not found', body: {} });
    }
  } catch(err) {
    if(err) {
      res.send({ success: false, message: 'something went wrong', body: {} });
    }
  }
})

server.listen(4000, () => console.log("🚀 Backend läuft auf Port 4000"));

var db = mongoose
  .connect(
    `${config.database.link}${config.database.user}:${config.database.password}@cluster0.2a0i2cd.mongodb.net/${config.database.repo}`
  )
  .then(() => {
    console.log("Database connection established");
  });
