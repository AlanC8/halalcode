import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { errorHandler } from "./middlewares/errorHandle";
import connectDB from "./db";
import globalRouter from "./global-router";
import { IMessage, Message } from "./messageModel/Message";
import addMessageToChat from "./chat/chat";


dotenv.config();


connectDB();


const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
 cors: {
   origin: "*",
   methods: ["GET", "POST"],
 },
});


app.use(cors({
     origin: process.env.FRONTEND_URL, 
     methods: ["GET", "POST", "PUT", "DELETE"],
     allowedHeaders: ["Content-Type", "Authorization"],
     credentials: true,
     }));
app.use(bodyParser.json());


app.use("/api/", globalRouter);

interface RoomUsers {
    [key: string]: string[];
  }

interface User {
    id: string;
    username: string;
    location: {
      lat: number;
      lng: number;
    };
  }
  
app.use(errorHandler);

let usersOnline: { [key: string]: User } = {};
let roomUsers: RoomUsers = {};


io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);


  socket.on("join_room", (roomId: string, username: string) => {
    socket.join(roomId);
    if (!roomUsers[roomId]) {
      roomUsers[roomId] = [];
    }
    roomUsers[roomId].push(socket.id);


    usersOnline[socket.id] = { id: socket.id, username, location: { lat: 0, lng: 0 } };
    io.emit("update_users", Object.values(usersOnline));


    io.to(roomId).emit("receive_message", {
      username: "System",
      text: `${username} joined the room.`,
      roomId,
      socketId: socket.id,
      messageId: Math.random().toString(36).substring(7),
    });
  });


  socket.on("send_message", async (data) => {
    console.log("Message received:", data);


    if (!data.socketID) {
      data.socketID = socket.id;
    }


    const messageData: Partial<IMessage> = {
      username: data.username,
      text: data.text,
      roomId: data.roomId,
      socketID: data.socketID,
      createdAt: new Date(),
      messageId: data.messageId,
    };


    await addMessageToChat(data.roomId, messageData);


    io.to(data.roomId).emit("receive_message", data);
  });


  socket.on("typing", (data) => {
    socket.to(data.roomId).emit("user_typing", { userId: data.userId });
  });


  socket.on("user_location", (data: { location: { lat: number; lng: number }, username: string }) => {
    usersOnline[socket.id] = { id: socket.id, username: data.username, location: data.location };
    io.emit("update_users", Object.values(usersOnline));
  });


  socket.on("disconnect", () => {
    console.log("User Disconnected " + socket.id);
    const user = usersOnline[socket.id];
    if (user) {
      delete usersOnline[socket.id];
      io.emit("update_users", Object.values(usersOnline));
      for (const roomId in roomUsers) {
        const index = roomUsers[roomId].indexOf(socket.id);
        if (index !== -1) {
          roomUsers[roomId].splice(index, 1);
          if (roomUsers[roomId].length === 0) {
            delete roomUsers[roomId];
          }
          io.to(roomId).emit("receive_message", {
            username: "System",
            text: `${user.username} left the room.`,
            roomId,
            socketId: socket.id,
            messageId: Math.random().toString(36).substring(7),
          });
        }
      }
    }
  });
});


const PORT = process.env.PORT || 6161;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


