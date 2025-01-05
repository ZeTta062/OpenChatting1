import { Server } from "socket.io"
import express from "express"
import * as http from "http";
import viteExpress from "vite-express";

const app = express();
const server = http.createServer(app);

const io = new Server(server);

io.on('connection', () => { /* _ */ });

server.listen(3000, () => {
    console.log("서버에서 듣고 있습니다.. 3000")
});

app.get("/message", (_, res) => res.send("Hello from express!"));
app.get("/api", (_, res) => res.send("Hello from api!"));

viteExpress.bind(app, server);