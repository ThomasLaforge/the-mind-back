import express from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import "dotenv/config";

const PORT = process.env.SERVER_PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server);

let players: Socket[] = [];
let nbTurn = 1;
let nbLife = 2;
let nbSShuriken = 1;
let cards: number[] = [];
let lastCardValue = 0;

for(let i=1; i<=100; i++) {
  cards.push(i);
}

io.on('connection', (socket) => { 
  players.push(socket);
  
  if(players.length === 2) {
    io.emit('partieprete', nbLife, nbSShuriken, nbTurn);
    players.forEach((socketPlayer, i) => {
      const playerCards = cards.splice(i * nbTurn, i * nbTurn + nbTurn);
      console.log('player cards at partieprete', playerCards);
      socketPlayer.emit('initialcards', playerCards);
    });
  }

  socket.on('playcard', (cardValue) => {
    const playerIndex = players.indexOf(socket);
    if(cardValue > lastCardValue) {
      lastCardValue = cardValue;
      // Check if other players have a lower card
      io.emit('cardplayed', cardValue);
    }
  });
});

server.listen(PORT, () => {
  console.log('server running at http://localhost:' + PORT);
});