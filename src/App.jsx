// src/App.jsx
import { useState, useEffect } from "react";
import Board from "./components/Board";
import Settings from "./components/Setting";
import { checkWinner, getAIMove } from "./utils/gameLogic";
import { updateTheme } from "./utils/theme";
import styles from "./styles/App.module.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  const [opponent, setOpponent] = useState("self");
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  // AI move effect
  useEffect(() => {
    if (opponent === "ai" && !isXNext && !winner) {
      const aiMove = getAIMove(board);
      if (aiMove !== null) {
        setTimeout(() => handleClick(aiMove), 500);
      }
    }
  }, [board, isXNext, winner, opponent]);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
    const result = checkWinner(newBoard);
    if (result) setWinner(result);
  };

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <h1>Tic Tac Toe</h1>
        <div className={styles.settingsContainer}>
          <button
            className={styles.settingsButton}
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            ⚙️ Settings
          </button>
          {settingsOpen && (
            <Settings
              theme={theme}
              opponent={opponent}
              setTheme={setTheme}
              setOpponent={(value) => {
                setOpponent(value);
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
