// src/components/Board.jsx
import styles from "../styles/Board.module.css";

function Board({ board, handleClick }) {
  return (
    <div className={styles.board}>
      {board.map((value, index) => (
        <div
          key={index}
          className={styles.cell}
          onClick={() => handleClick(index)}
        >
          {value}
        </div>
      ))}
    </div>
  );
}

export default Board;
