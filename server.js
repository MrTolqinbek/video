const express = require('express')
const app = express()
const {v4:uuidv4} = require('uuid')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)
const {ExpressPeerServer} = require('peer')
const peerServer = ExpressPeerServer(server,{
    debug:true
})
const public = path.join(__dirname,'public')
app.set('view engine','ejs')
app.use('/peerjs',peerServer)
app.use(express.static(public))
app.get('/',(req,res)=>{
    res.redirect('/'+uuidv4())
})
app.get('/:room',(req,res)=>{
  res.render('room',{roomID:req.params.room})
})

io.on('connection',(socket)=>{

socket.on('join',(roomID,userID)=>{
    socket.join(roomID)
    socket.broadcast.to(roomID).emit("connect-user",userID)
    socket.on('message',(msg)=>{
        io.to(roomID).emit('createmessage',msg)
    })
})
})


server.listen(9000,()=>{
    console.log("server is running")
});