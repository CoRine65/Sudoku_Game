import { useEffect, useState } from "react";
import SudokuBoard from "../components/SudokuBoard";
import "./SudokuGamePage.css";

export default function SudokuGamePage() {
  const [playerBoard, setPlayerBoard] = useState([
    [5, 3, "", "", 7, "", "", "", ""],
    [6, "", "", 1, 9, 5, "", "", ""],
    ["", 9, 8, "", "", "", "", 6, ""],
    [8, "", "", "", 6, "", "", "", 3],
    [4, "", "", 8, "", 3, "", "", 1],
    [7, "", "", "", 2, "", "", "", 6],
    ["", 6, "", "", "", "", 2, 8, ""],
    ["", "", "", 4, 1, 9, "", "", 5],
    ["", "", "", "", 8, "", "", 7, 9],
  ]);

  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [gameSsessionId, setGameSessionId] = useState(null);
  const [givenBoard, setGivenBoard] = useState([]);
  const [invalidCells, setInvalidCells] = useState([]);

  function getInvalidCells(board) {
    const invalid = [];

    function markInvalid(row, col) {
      const alreadyMarked = invalid.some(
        (cell) => cell.row === row && cell.col === col
      );

      if (!alreadyMarked) {
        invalid.push({ row, col });
      }
    }

    // Check rows
    for (let row = 0; row < 9; row++) {
      const seen = {};

      for (let col = 0; col < 9; col++) {
        const value = board[row][col];
        if (value === "") continue;

        if (!seen[value]) {
          seen[value] = [{ row, col }];
        } else {
          seen[value].push({ row, col });
        }
      }

      Object.values(seen).forEach((cells) => {
        if (cells.length > 1) {
          cells.forEach((cell) => markInvalid(cell.row, cell.col));
        }
      });
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
      const seen = {};

      for (let row = 0; row < 9; row++) {
        const value = board[row][col];
        if (value === "") continue;

        if (!seen[value]) {
          seen[value] = [{ row, col }];
        } else {
          seen[value].push({ row, col });
        }
      }

      Object.values(seen).forEach((cells) => {
        if (cells.length > 1) {
          cells.forEach((cell) => markInvalid(cell.row, cell.col));
        }
      });
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = {};

        for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
          for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
            const value = board[row][col];
            if (value === "") continue;

            if (!seen[value]) {
              seen[value] = [{ row, col }];
            } else {
              seen[value].push({ row, col });
            }
          }
        }

        Object.values(seen).forEach((cells) => {
          if (cells.length > 1) {
            cells.forEach((cell) => markInvalid(cell.row, cell.col));
          }
        });
      }
    }

    return invalid;
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (!selectedCell) return;

      const { row, col } = selectedCell;
      const isGiven =
        givenBoard?.[row]?.[col] !== "" && givenBoard?.[row]?.[col] != null;

      if (isGiven) return;

      if (event.key >= "1" && event.key <= "9") {
        setPlayerBoard((prevBoard) => {
          const newBoard = prevBoard.map((currentRow) => [...currentRow]);
          newBoard[row][col] = Number(event.key);

          setInvalidCells(getInvalidCells(newBoard));
          return newBoard;
        });
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        setPlayerBoard((prevBoard) => {
          const newBoard = prevBoard.map((currentRow) => [...currentRow]);
          newBoard[row][col] = "";

          setInvalidCells(getInvalidCells(newBoard));
          return newBoard;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCell, givenBoard]);

  async function handleStartGame() {
    const difficultyToPuzzleId = {
      easy: 1,
      medium: 2,
    };

    const puzzleId = difficultyToPuzzleId[selectedDifficulty];

    if (!puzzleId) {
      alert("Please choose a difficulty first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/game_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          puzzle_id: puzzleId,
        }),
      });

      const data = await response.json();

      const normalizedBoard = data.current_board.map((row) =>
        row.map((cell) => cell ?? "")
      );

      const normalizedGivenBoard = data.puzzle.given_board.map((row) =>
        row.map((cell) => cell ?? "")
      );

      setGameSessionId(data.id);
      setPlayerBoard(normalizedBoard);
      setGivenBoard(normalizedGivenBoard);
      setInvalidCells(getInvalidCells(normalizedBoard));
      setSelectedCell(null);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  }

  return (
    <main className="game-page">
      <section className="side-panel">
        <div className="panel-header">
          <h2>Player</h2>
          <div className="panel-stats">
            <span>⏱ 00:00</span>
            <span>Wins: 0</span>
          </div>
        </div>

        <SudokuBoard
          board={playerBoard}
          givenBoard={givenBoard}
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
          invalidCells={invalidCells}
        />
      </section>

      <section className="control-panel">
        <h2>Game Controls</h2>

        <div className="difficulty-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            name="difficulty"
            value={selectedDifficulty}
            onChange={(event) => setSelectedDifficulty(event.target.value)}
          >
            <option value="">Choose difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button className="start-btn" onClick={handleStartGame}>
          Start Game
        </button>
      </section>

      <section className="side-panel">
        <div className="panel-header">
          <h2>Computer</h2>
          <div className="panel-stats">
            <span>Wins: 0</span>
            <span>⏱ 00:00</span>
          </div>
        </div>

        <SudokuBoard />
      </section>
    </main>
  );
}