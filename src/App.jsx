import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  const [opponent, setOpponent] = useState("self");
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const updateSystemTheme = () => {
      if (theme === "system") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        root.setAttribute("data-theme", prefersDark ? "dark" : "light");
      } else {
        root.setAttribute("data-theme", theme);
      }
    };
    updateSystemTheme();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateSystemTheme);
    localStorage.setItem("theme", theme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, [theme]);

  useEffect(() => {
    if (opponent === "ai" && !isXNext && !winner) {
      const aiMove = getAIMove(board);
      if (aiMove !== null) {
        setTimeout(() => handleClick(aiMove), 500);
      }
    }
  }, [board, isXNext, winner, opponent]);

  const checkWinner = (newBoard) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return newBoard[a];
      }
    }
    return newBoard.includes(null) ? null : "Draw";
  };

  const getAIMove = (currentBoard) => {
    const emptyCells = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);
    return emptyCells.length > 0
      ? emptyCells[Math.floor(Math.random() * emptyCells.length)]
      : null;
  };

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
    <div className="container">
      <div className="top-bar">
        <h1>Tic Tac Toe</h1>
        <div className="settings-container">
          <button
            className="settings-button"
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            ⚙️ Settings
          </button>
          {settingsOpen && (
            <div className="settings-dropdown">
              <div className="setting-item">
                <label>Theme:</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="system">System</option>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Opponent:</label>
                <select
                  value={opponent}
                  onChange={(e) => {
                    setOpponent(e.target.value);
                    restartGame();
                  }}
                >
                  <option value="self">Self</option>
                  <option value="ai">AI</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {winner && (
        <h2 className="winner-text">
          {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
        </h2>
      )}

      <div className="board">
        {board.map((value, index) => (
          <div key={index} className="cell" onClick={() => handleClick(index)}>
            {value}
          </div>
        ))}
      </div>

      <button className="restart" onClick={restartGame}>
        Restart
      </button>
    </div>
  );
}

export default App;
