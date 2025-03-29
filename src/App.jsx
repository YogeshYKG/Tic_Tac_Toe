import { useState } from "react";
import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const checkWinner = (newBoard) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
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

    return newBoard.includes(null) ? null : "Draw"; // If no winner and board is full, it's a draw
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
      <h1>Tic Tac Toe</h1>
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
