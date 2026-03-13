export default function SudokuBoard({ board, selectedCell, setSelectedCell, givenBoard = [] }) {
  const cells = Array.from({ length: 81 }, (_, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const value = board?.[row]?.[col] ?? "";

    const isGiven = givenBoard?.[row]?.[col] !== "" && givenBoard?.[row]?.[col] != null;
    const isSelected =
      selectedCell?.row === row && selectedCell?.col === col;

    const classes = [
      "cell",
      col % 3 === 0 ? "thick-left" : "",
      row % 3 === 0 ? "thick-top" : "",
      isSelected ? "selected" : "",
    ].join(" ");

    return {
      index,
      row,
      col,
      value,
      isGiven,
      classes,
    };
  });

  return (
    <div className="sudoku-board">
      {cells.map((cell) => (
        <div
          key={cell.index}
          className={cell.classes}
          onClick={() => {
            if (cell.isGiven) return;
            setSelectedCell?.({ row: cell.row, col: cell.col });
          }}
        >
          {cell.value}
        </div>
      ))}
    </div>
  );
}