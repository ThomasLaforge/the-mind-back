import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);
let nbPlayers = 0;


io.on('connection', (socket) => { 
  nbPlayers++;
  if(nbPlayers === 2)  {
    socket.emit('partieprete');
    console.log('partieprete');
  }
  socket.on('demandesynchro', (msg) => {
    console.log('demandesynchro' + msg);
  })
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    socket.broadcast.emit('patate', msg)
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});