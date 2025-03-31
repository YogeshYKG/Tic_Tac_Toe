const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (change in production)
    methods: ["GET", "POST"]
  }
});

const games = {}; // Store game states

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinGame", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Initialize game state if new room
    if (!games[roomId]) {
      games[roomId] = { board: Array(9).fill(null), isXNext: true, players: [] };
    }

    // Add player to room
    if (games[roomId].players.length < 2) {
      games[roomId].players.push(socket.id);
    } else {
      socket.emit("errorMessage", "Room full");
      return;
    }

    // Send current game state to all players in the room
    io.to(roomId).emit("gameState", games[roomId]);
  });

  socket.on("makeMove", ({ roomId, index }) => {
    const game = games[roomId];

    if (!game || game.board[index] || checkWinner(game.board)) {
      socket.emit("errorMessage", "Invalid move");
      return;
    }

    game.board[index] = game.isXNext ? "X" : "O";
    game.isXNext = !game.isXNext;

    io.to(roomId).emit("gameState", game); // Broadcast updated state
  });

  socket.on("restartGame", (roomId) => {
    if (games[roomId]) {
      games[roomId].board = Array(9).fill(null);
      games[roomId].isXNext = true;
      io.to(roomId).emit("gameState", games[roomId]);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove player from games
    for (const roomId in games) {
      games[roomId].players = games[roomId].players.filter(id => id !== socket.id);

      // Delete game if no players left
      if (games[roomId].players.length === 0) {
        delete games[roomId];
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

function checkWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winPatterns.some(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}
