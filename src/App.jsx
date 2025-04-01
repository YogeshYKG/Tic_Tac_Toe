import { io } from "socket.io-client";
// src/App.jsx
import { useState, useEffect, useRef } from "react";
import Board from "./components/Board";
import Settings from "./components/Setting";
import { checkWinner, getAIMove } from "./utils/gameLogic";
import { updateTheme } from "./utils/theme";
import styles from "./styles/App.module.css";

// Create the Socket.io connection outside the component.
// (In production, update the URL as needed.)
const socket = io("https://tictactoe-backend-production.up.railway.app/");

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  const [opponent, setOpponent] = useState("self");
  const [multiplayer, setMultiplayer] = useState("offline");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // For simplicity, using a fixed room id. Later you can make it dynamic.
  const [roomId, setRoomId] = useState("game123");


  // Close Setting when clicked outside
  const settingsRef = useRef(null);
  useEffect(()=>{
    debugger
    function handleClickOutside(event){
      if(settingsRef.current && !settingsRef.current.contains(event.target)){
        setSettingsOpen(false);
      }
    }
      if(settingsOpen){
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.addEventListener('mousedown', handleClickOutside);
      }
    
  }, [settingsOpen])
  


  // Update theme based on user preference
  useEffect(() => {
    const root = document.documentElement;
    updateTheme(theme, root);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = () => updateTheme(theme, root);
    mediaQuery.addEventListener("change", handleThemeChange);
    localStorage.setItem("theme", theme);
    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, [theme]);

  // If multiplayer is enabled, join a game room and listen for game updates.
  useEffect(() => {
    debugger;
    if (multiplayer === "online") {
      // Join the room
      socket.emit("joinGame", roomId);

      // Listen for game state updates from the server
      socket.on("gameState", (game) => {
        setBoard(game.board);
        setIsXNext(game.isXNext);
      });

      // Clean up the event listener on unmount or when multiplayer changes
      return () => socket.off("gameState");
    }
  }, [multiplayer, roomId]);

  // AI move effect
  useEffect(() => {
    if (opponent === "ai" && !isXNext && !winner && multiplayer === "offline") {
      const aiMove = getAIMove(board);
      if (aiMove !== null) {
        setTimeout(() => handleClick(aiMove), 500);
      }
    }
  }, [board, isXNext, winner, opponent]);

  const handleClick = (index) => {
    // Prevent move if cell already occupied or game over
    if (board[index] || winner) return;
    if (multiplayer === "online") {
      // For multiplayer, emit the move to the server
      socket.emit("makeMove", { roomId, index });
    } else {
      const newBoard = [...board];
      newBoard[index] = isXNext ? "X" : "O";
      setBoard(newBoard);
      setIsXNext(!isXNext);
      const result = checkWinner(newBoard);
      if (result) setWinner(result);
    }
  };

  const restartGame = () => {
    if (multiplayer === "online") {
      socket.emit("restartGame", roomId);
    } else {
      setBoard(Array(9).fill(null));
      setIsXNext(true);
      setWinner(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <h1>Tic Tac Toe</h1>
        <div className={styles.settingsContainer} ref={settingsRef}>
          <button
            className={styles.settingsButton}
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            ⚙️ Settings
          </button>
          {settingsOpen && (
            <Settings
              theme={theme}
              setTheme={setTheme}
              opponent={opponent}
              setOpponent={(value) => {
                setOpponent(value);
                restartGame();
              }}
              multiplayer={multiplayer}
              setMultiplayer={(value) => {
                setMultiplayer(value);
                restartGame();
              }}
            />
          )}
        </div>
      </div>

      {winner && (
        <h2 className={styles.winnerText}>
          {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
        </h2>
      )}

      <Board board={board} handleClick={handleClick} />

      <button className={styles.restart} onClick={restartGame}>
        Restart
      </button>
    </div>
  );
}

export default App;
