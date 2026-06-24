const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files (je HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Server draait op poort 3000 of environment PORT
const PORT = process.env.PORT || 3000;

// Wanneer een client verbindt
let gameRooms = {};
let waitingPlayers = [];

io.on('connection', (socket) => {
  console.log('New player connected:', socket.id);

  // Wanneer speler op "Play" klikt
  socket.on('joinGame', () => {
    console.log('Player wants to play:', socket.id);

    if (waitingPlayers.length === 0) {
      // Eerste speler - wordt WHITE
      waitingPlayers.push(socket.id);
      socket.emit('waiting', 'Wachten op tegenstander...');
      console.log('Player waiting, total waiting:', waitingPlayers.length);
    } else {
      // Tweede speler - wordt BLACK, game start
      const player1 = waitingPlayers.shift();
      const player2 = socket.id;
      const roomId = `game-${player1}-${player2}`;

      gameRooms[roomId] = {
        players: [player1, player2],
        spectators: [],
        white: player1,
        black: player2,
        moves: []
      };

      // Voeg beide spelers toe aan room
      io.sockets.sockets.get(player1).join(roomId);
      socket.join(roomId);

      // Stuur game start - separate messages for each player
      // Player 1 is WHITE
      io.sockets.sockets.get(player1).emit('gameStart', {
        roomId: roomId,
        white: player1,
        black: player2,
        yourColor: 'white'
      });

      // Player 2 is BLACK
      socket.emit('gameStart', {
        roomId: roomId,
        white: player1,
        black: player2,
        yourColor: 'black'
      });

      console.log(`Game started: ${roomId}`);
    }
  });

  // Wanneer speler een zet doet
  socket.on('makeMove', (data) => {
    const { roomId, move } = data;
    const room = gameRooms[roomId];

    if (room) {
      room.moves.push(move);
      // Stuur zet naar alle in de room (spelers + spectators)
      io.to(roomId).emit('opponentMove', move);
      console.log(`Move in ${roomId}:`, move);
    }
  });

  // Wanneer speler disconnect
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    
    // Verwijder uit waiting list
    waitingPlayers = waitingPlayers.filter(id => id !== socket.id);

    // Verwijder uit game rooms
    for (const roomId in gameRooms) {
      const room = gameRooms[roomId];
      if (room.players.includes(socket.id)) {
        io.to(roomId).emit('playerDisconnected', 'Opponent verliet het spel');
        delete gameRooms[roomId];
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Chess server running on http://localhost:${PORT}`);
});