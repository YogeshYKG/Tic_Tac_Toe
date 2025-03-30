// src/utils/gameLogic.js
export const checkWinner = (newBoard) => {
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
  for (let [a, b, c] of winPatterns) {
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

export const getAIMove = (currentBoard) => {
  const emptyCells = currentBoard
    .map((val, idx) => (val === null ? idx : null))
    .filter((val) => val !== null);
  return emptyCells.length > 0
    ? emptyCells[Math.floor(Math.random() * emptyCells.length)]
    : null;
};
