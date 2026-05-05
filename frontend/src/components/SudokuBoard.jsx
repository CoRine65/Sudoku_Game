export default function SudokuBoard({
  board,
  selectedCell,
  setSelectedCell,
  hasWon,
  givenBoard = [],
  invalidCells = [],
  isInteractive = true,
  hideNonGivenValues= false,
}) {
  const selectedRow = selectedCell?.row ?? null;
  const selectedCol = selectedCell?.col ?? null;
  const selectedValue =
    selectedRow !== null && selectedCol !== null
      ? board?.[selectedRow]?.[selectedCol] ?? ""
      : "";

  const cells = Array.from({ length: 81 }, (_, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const value = board?.[row]?.[col] ?? "";

    const isGiven =
      givenBoard?.[row]?.[col] !== "" && givenBoard?.[row]?.[col] != null;

    const shouldHideValue = hideNonGivenValues && !isGiven && value !== "";
    const displayValue = shouldHideValue ? "" : value;
    const pastelClass = shouldHideValue
      ? `pastel-${(index * 7 + 3) % 6}`
      : "";  

    const isSelected = selectedRow === row && selectedCol === col;

    const isSameRow = selectedRow !== null && row === selectedRow;
    const isSameColumn = selectedCol !== null && col === selectedCol;

    const isSameBox =
      selectedRow !== null &&
      selectedCol !== null &&
      Math.floor(row / 3) === Math.floor(selectedRow / 3) &&
      Math.floor(col / 3) === Math.floor(selectedCol / 3);

    const isRelated = !isSelected && (isSameRow || isSameColumn || isSameBox);

    const isSameValue =
      selectedValue !== "" && !isSelected && value === selectedValue;

    const isInvalid = invalidCells.some(
      (cell) => cell.row === row && cell.col === col
    );

    const classes = [
      "cell",
      col % 3 === 0 ? "thick-left" : "",
      row % 3 === 0 ? "thick-top" : "",
      isGiven ? "given" : "",
      isRelated ? "highlighted" : "",
      isSameValue ? "same-value" : "",
      isSelected ? "selected" : "",
      isInvalid ? "invalid" : "",
      shouldHideValue ? "hidden-computer-value" : "",
      pastelClass,
    ].join(" ");

    return {
      index,
      row,
      col,
      value,
      isGiven,
      classes,
      displayValue,
    };
  });

  return (
    <div className={`sudoku-board ${hasWon ? "win-active" : ""}`}>
      {cells.map((cell) => (
        <div
          key={cell.index}
          className={cell.classes}
          onClick={() => {
            if (!isInteractive) return;
            setSelectedCell?.({ row: cell.row, col: cell.col });
          }}
        >
          {cell.displayValue}
        </div>
      ))}
    </div>
  );
}