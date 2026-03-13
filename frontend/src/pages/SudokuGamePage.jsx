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
  const [gameSessionId, setGameSessionId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [givenBoard, setGivenBoard] = useState([]);


  useEffect(() => {
    function handleKeyDown(event) {
      if (!selectedCell) return;

      const { row, col } = selectedCell;

      if (event.key >= "1" && event.key <= "9") {
        setPlayerBoard((prevBoard) => {
          const newBoard = prevBoard.map((currentRow) => [...currentRow]);
          newBoard[row][col] = Number(event.key);
          return newBoard;
        });
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        setPlayerBoard((prevBoard) => {
          const newBoard = prevBoard.map((currentRow) => [...currentRow]);
          newBoard[row][col] = "";
          return newBoard;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCell]);

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
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
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
            onChange={(event) => setSelectedDifficulty(event.target.value)}>
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