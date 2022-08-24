const http = require("http");
const express= require("express");
const socketIO = require("socket.io")
const cors = require("cors");

const app = express();
const port = 4500;

const server = http.createServer(app);
const io = socketIO(server);
app.use(cors());

const users = [{}]

app.use("/", (req, res)=>{
    res.send('hello world hello again again hey')
})

io.on('connection',(socket)=>{
    // console.log('someone connected');
    socket.on("joined",({user})=>{
        users[socket.id] = user
        // console.log(`${user} has joined!`)
        socket.broadcast.emit("userJoined", {user:"Admin", message:`${users[socket.id]} has joined`})
        socket.emit("welcome",{user:"Admin", message:`Welcome to the chat, ${user} `})
    });
    socket.on("userText",({msg,id})=>{
        io.emit("userMessage",{user:users[id],message:msg,id})
    })

    socket.on("disconnect",()=>{
        socket.broadcast.emit('leave',{user:"Admin", message:`user have left`})
        // console.log('user left')
    })    
})

server.listen(port,()=>{
    // console.log(`express server running on port ${port}`)
})



