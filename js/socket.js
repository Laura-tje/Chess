// Socket.io Client

const socket = io();

let currentRoom = null;
let myColor = null;

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
  // Automatisch joinen wanneer verbonden
  socket.emit('joinGame');
});

socket.on('waiting', (msg) => {
  console.log(msg);
  document.getElementById('game-status').textContent = msg;
  document.getElementById('game-status').style.background = '#FFF9C4';
});

socket.on('gameStart', (data) => {
  console.log('Game started!', data);
  currentRoom = data.roomId;
  myColor = data.yourColor;
  
  const colorText = myColor === 'white' ? 'Wit' : 'Zwart';
  document.getElementById('game-status').textContent = `Spel gestart! Jij bent ${colorText}`;
  document.getElementById('game-status').style.background = '#C8E6C9';
  
  // Call the game start function in main.js
  if (window.startMultiplayerGame) {
    window.startMultiplayerGame(myColor);
  }
});

socket.on('opponentMove', (move) => {
  console.log('Opponent moved:', move);
  // Dit gaan we later in main.js afhandelen
  window.handleOpponentMove(move);
});

socket.on('playerDisconnected', (msg) => {
  console.log(msg);
  document.getElementById('game-status').textContent = msg;
  document.getElementById('game-status').style.background = '#FFCDD2';
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Functies om naar server te sturen
export function sendMove(move) {
  if (currentRoom) {
    socket.emit('makeMove', { roomId: currentRoom, move });
  }
}

export { socket, currentRoom, myColor };