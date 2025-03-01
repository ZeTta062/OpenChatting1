import { Server } from "socket.io"
import express from "express"
import * as http from "http";
import viteExpress from "vite-express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on('connection', (client) => { 
    console.log("사용자가 들어왔습니다!");
    console.log(client.handshake.query);

    const connectedClientUsername = client.handshake.query.username;

    console.log(`사용자가 들어왔습니다! ${connectedClientUsername}`);

    client.broadcast.emit("new_message", {username : "관리자", message: `${connectedClientUsername}님이 방에 들어왔습니다.`})

    client.on('new_message', (msg) => {
        io.emit("new_message", {username : msg.username, message: msg.message})
    })

    client.on('disconnect', () => {
        console.log(`사용자가 나갔습니다... ${connectedClientUsername}`);
        io.emit("new_message", {username : "관리자", message: `${connectedClientUsername}님이 방에서 떠났습니다.`})
    })
 });


server.listen(3000, () => {
    console.log("서버에서 듣고 있습니다.. 3000");
});

app.get("/message", (_, res) => res.send("Hello from express!"));
app.get("/api", (_, res) => res.send("Hello from api!"));

viteExpress.bind(app, server);