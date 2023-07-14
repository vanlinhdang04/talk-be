const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/data");
const connectDB = require("./config/db");
const { yellow } = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoute");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const cors = require("cors");

dotenv.config();

connectDB();
const app = express();
app.use(express.json());

app.use(cors());

app.get("/api", (req, res) => {
  res.send("API is running.");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });
// app.get("/api/chat/:id", (req, res) => {
//   const singleChat = chats.find((c) => c._id === req.params.id);
//   res.send(singleChat);
// });

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`.yellow);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("[SOCKET] Connected to socket.io".green);

  // setup room each user
  socket.on("setup", (userInfo) => {
    socket.join(userInfo?._id);
    console.log(`[SOCKET] setup user ${userInfo.email}`.blue);
    socket.emit("connected");
  });

  // setup room each chat room
  socket.on("joinChat", (chat) => {
    socket.join(chat);
    console.log(`[SOCKET] User joined room: ${chat}`);
  });

  // Typing chat
  socket.on("typing", (chat) => {
    socket.in(chat).emit("typing");
  });
  socket.on("stopTyping", (chat) => {
    socket.in(chat).emit("stopTyping");
  });

  // send new message
  socket.on("newMessage", (message) => {
    const chat = message?.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user?._id === message?.sender?._id) return;
      console.log("send mess");
      socket.in(user._id).emit("messageRecieved", message);
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnect");
    socket.leave(userInfo?._id);
  });

  socket.on("disconnect", () => {
    console.log("[SOCKET] Disconnected socket.io".red, socket);
  });
});
