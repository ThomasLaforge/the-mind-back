import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const shuffle = (array: number[]) => {
  const arrToShuffle = array.slice()
  arrToShuffle.sort( () => .5 - Math.random() );
  return arrToShuffle
}
const app = express();
const server = createServer(app);
const io = new Server(server);
let nbPlayers = 0;
let initialcards :number[] = [];
let Players: any[] = [];
let nbTurns = 0;


io.on('connection', (socket) => { 
  Players.push(socket)
  if(Players.length === 2)  {
    console.log('partieprete')
    nbTurns = nbTurns + 1
    initialcards = []

    for (let i = 1; i < 101; i++) {
      initialcards.push(i);
    }

    initialcards = shuffle(initialcards);

    for (let i = 0; i < Players.length; i++) {
      const s = Players[i];
      const cartesJoueur = initialcards.slice(0, nbTurns)
      initialcards = initialcards.slice(nbTurns)
      console.log('Cartes J' + (i + 1) ,cartesJoueur)
      s.emit('partieprete', cartesJoueur);
    }
  };
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    socket.broadcast.emit('patate', msg)
  });
  socket.on('demandesynchro', (msg) => {
    console.log('demandesynchro' +  msg);
    socket.broadcast.emit('synchrook', msg)
  });

});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});