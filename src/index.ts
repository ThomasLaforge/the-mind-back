import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const app = express();
const server = createServer(app);
const io = new Server(server);
let nbPlayers = 0;
let initialcards :number[] = [];
let Players: any[] = [];
// let Cards



io.on('connection', (socket) => { 
  Players.push(socket)
  if(Players.length === 2)  {
    io.emit('partieprete');
    console.log('partieprete')
    for (let i = 1; i < 101; i++) {
      initialcards.push(i);
        
    }
  }

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    socket.broadcast.emit('patate', msg)
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});