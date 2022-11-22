import http from "http";
import express from "express";
import { Server as SocketServer } from "socket.io";
import { v4 as uuidV4 } from "uuid";
import cors from "cors";

const PORT: number = Number(process.env.PORT) || 8000;
const app: express.Application = express();

const server: http.Server = http.createServer(app);
const io = new SocketServer({ cors: { origin: "*" } });
io.attach(server);

interface User {
  socketId: string;
  username: string;
  displayPicture: string;
  platform: string;
  joinedAt: Date;
  isConnected: boolean;
}

interface RoomUser {
  id: string;
  fullname: string;
  email: string;
}

app.use(cors());
app.use(express.json());

/* State Variables */
const users: Map<string, User> = new Map<string, User>();
const roomUsers: Map<string, RoomUser> = new Map();

io.on("connection", (socket) => {
  console.log(`New Socket Connection: ${socket.id}`);

  socket.on("room:join", (data) => {
    const { username, displayPicture, platform } = data;
    users.set(socket.id, {
      socketId: socket.id,
      username,
      displayPicture,
      platform,
      joinedAt: new Date(),
      isConnected: false,
    });
    io.emit("refresh:user-list");
  });

  socket.on("peer:call", (data) => {
    const { to, offer } = data;
    socket.to(to).emit("peer:incomming-call", {
      from: socket.id,
      user: users.get(socket.id),
      offer,
    });
  });

  socket.on("peer:call:accepted", (data) => {
    const { to, offer } = data;
    if (users.has(to)) {
      //@ts-ignore
      users.get(to)?.isConnected = true;
    }
    if (users.has(socket.id)) {
      //@ts-ignore
      users.get(socket.id)?.isConnected = true;
    }

    socket.to(to).emit("peer:call:accepted", {
      from: socket.id,
      user: users.get(socket.id),
      offer,
    });

    const whiteboardID = uuidV4();
    io.to([to, socket.id]).emit("whiteboard:id", { whiteboardID });

    io.emit("refresh:user-list");
  });

  socket.on("peer:negotiate", (data) => {
    const { to, offer } = data;

    socket.to(to).emit("peer:negotiate", { from: socket.id, offer });
  });

  socket.on("peer:negosiate:result", (data) => {
    const { to, offer } = data;

    socket.to(to).emit("peer:negosiate:result", { from: socket.id, offer });
  });

  socket.on("whiteboard:drawing", (data) => {
    const { to } = data;

    socket.to(to).emit("whiteboard:data", { from: socket.id, data: data });
  });

  socket.on("chat:message", (data) => {
    const { to, message } = data;
    socket.emit("chat:message", {
      from: socket.id,
      message,
      self: true,
      user: users.get(socket.id),
    });
    socket.to(to).emit("chat:message", {
      from: socket.id,
      message,
      user: users.get(socket.id),
    });
  });

  socket.on("disconnect", () => {
    users.delete(socket.id);
    io.emit("user-disconnected", { socketId: socket.id });
    io.emit("refresh:user-list");
  });
});

app.get("/users", (req, res) => {
  const idleUsers: any[] = Array.from(users.values())
    .map((e) => ({
      ...e,
    }))
    .filter((e) => !e.isConnected);
  return res.json({ users: idleUsers });
});

server.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
