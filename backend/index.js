const config = require("../config.json");
const mongoose = require("mongoose");

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");

// Database
const Users = require("./schemas/Users");
const Classes = require("./schemas/Classes");
const hat = require("hat");

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

async function GetUserIdByUsername(username) {
  const user = await Users.findOne({ username: username });

  return user.userId;
}

io.on("connection", (socket) => {
  socket.on("GetClasses", async (data, cb) => {
    let _classes = await Classes.find({});
    let USID = await GetUserIdByUsername(data.user.name);
    _classes = _classes.filter((cls) => cls.teachers.find((t) => t == USID));
    if (_classes) {
      cb({ success: true, data: _classes });
    } else {
      cb({ success: false, data: null });
    }
  });

  socket.on("createClass", async (data, cb) => {
    try {
      const user = await Users.findOne({ username: data.username });
      const classId = hat();
      const newClass = await Classes.create({
        classId: classId,
        teachers: [user.userId],
        name: data.newClassName.current,
      });

      await user.updateOne({
        $push: {
          classes: classId,
        },
      });

      cb({ success: true, data: newClass });
    } catch (err) {
      if (err) {
        console.log(err);
        cb({ success: false, data: null });
      }
    }
  });

  socket.on("GetClassData", async (data, cb) => {
    const findClass = await Classes.findOne({ classId: data.id });

    if (findClass) {
      cb({ success: true, data: findClass });
    } else {
      cb({ success: false, data: null });
    }
  });

  socket.on("GetTeachers", async (data, cb) => {
    const teachers = await Users.find({});

    if (teachers) {
      cb({ success: true, data: teachers });
    } else {
      cb({ success: false, data: null });
    }
  });

  socket.on("AddTeacher", async (data, cb) => {
    console.log(data);
    const teacher = await Users.findOne({ userId: data.user });

    try {
      if (teacher) {
        await teacher.updateOne({
          $push: {
            classes: data.class,
          },
        });

        await Classes.findOneAndUpdate(
          {
            classId: data.class,
          },
          {
            $push: {
              teachers: teacher.userId,
            },
          }
        );

        cb({ success: true, data: teacher });
      } else {
        cb({ success: false, data: null });
      }
    } catch (err) {
      if (err) {
        cb({ success: false, data: null });
      }
    }
  });

  socket.on('RemoveTeacher', async (data, cb) => {
    try {
      const teacher = await Users.findOne({ userId: data.user });

      if (!teacher) {
        return cb({ success: false, data: null, message: "Teacher not found" });
      }

      // Entferne die Klasse aus dem Lehrer-Dokument
      await teacher.updateOne({
        $pull: {
          classes: data.class,
        },
      });

      // Entferne den Lehrer aus der Klassenliste
      await Classes.findOneAndUpdate(
        { classId: data.class },
        {
          $pull: {
            teachers: teacher.userId,
          },
        }
      );

      cb({ success: true, message: "Teacher removed successfully", data: null });
    } catch (err) {
      console.error("Error removing teacher:", err);
      cb({ success: false, message: "Error removing teacher", data: null });
    }
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/login", async (req, res) => {
  try {
    const findUser = await Users.findOne({ username: req.body.username });

    if (findUser) {
      if (req.body.password == findUser.password) {
        res.send({ success: true, message: "login worked", body: findUser });
      } else {
        res.send({ success: false, message: "wrong password", body: {} });
      }
    } else {
      res.send({ success: false, message: "User not found", body: {} });
    }
  } catch (err) {
    if (err) {
      res.send({ success: false, message: "something went wrong", body: {} });
    }
  }
});

server.listen(4000, () => console.log("🚀 Backend läuft auf Port 4000"));

var db = mongoose
  .connect(
    `${config.database.link}${config.database.user}:${config.database.password}@cluster0.2a0i2cd.mongodb.net/${config.database.repo}`
  )
  .then(() => {
    console.log("Database connection established");
  });
