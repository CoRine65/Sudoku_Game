// src/components/SudokuBoard.jsx
export default function SudokuBoard() {
  const cells = Array.from({ length: 81 }, (_, index) => index);

  return (
    <div className="sudoku-board">
      {cells.map((cell) => {
        const row = Math.floor(cell / 9);
        const col = cell % 9;

        const classes = [
          "cell",
          col % 3 === 0 ? "thick-left" : "",
          row % 3 === 0 ? "thick-top" : "",
          col === 8 ? "thick-right" : "",
          row === 8 ? "thick-bottom" : "",
        ].join(" ");

        return (
          <div key={cell} className={classes}>
            {/* placeholder */}
          </div>
        );
      })}
    </div>
  );
}