import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { errorHandler } from "./middlewares/errorHandle";
import connectDB from "./db";
import globalRouter from "./global-router";

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

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(bodyParser.json());

app.use("/api/", globalRouter);

app.use(errorHandler);

let users = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("locationUpdate", (locationData) => {
    users[socket.id] = locationData;
    io.emit("usersLocations", users);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    delete users[socket.id];
    io.emit("usersLocations", users);
  });
});

const PORT = process.env.PORT || 6161;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
