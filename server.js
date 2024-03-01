const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);


const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


app.use(express.static(path.join(__dirname, 'public')));



io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);


  socket.on('drawing', (data) => {
   
    socket.broadcast.emit('drawing', data);
  });
 
  socket.on('message', (data) => {
    socket.broadcast.emit('message', data);
  });

 
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = 9090
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
