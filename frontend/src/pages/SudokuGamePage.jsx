import { useEffect, useState } from "react";
import SudokuBoard from "../components/SudokuBoard";
import "./SudokuGamePage.css";

const STARTER_BOARD = [
  [5, 3, "", "", 7, "", "", "", ""],
  [6, "", "", 1, 9, 5, "", "", ""],
  ["", 9, 8, "", "", "", "", 6, ""],
  [8, "", "", "", 6, "", "", "", 3],
  [4, "", "", 8, "", 3, "", "", 1],
  [7, "", "", "", 2, "", "", "", 6],
  ["", 6, "", "", "", "", 2, 8, ""],
  ["", "", "", 4, 1, 9, "", "", 5],
  ["", "", "", "", 8, "", "", 7, 9],
];

function copyBoard(board) {
  return board.map((row) => [...row]);
}

function normalizeBoard(board) {
  return board.map((row) => {
    const filledRow = row.map((cell) => cell ?? "");

    while (filledRow.length < 9) {
      filledRow.push("");
    }

    return filledRow;
  });
}

export default function SudokuGamePage() {
  // Board state
  const [playerBoard, setPlayerBoard] = useState(STARTER_BOARD);
  const [computerBoard, setComputerBoard] = useState(STARTER_BOARD);
  const [givenBoard, setGivenBoard] = useState([]);
  const [solutionBoard, setSolutionBoard] = useState([]);

  // UI / game state
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [gameSessionId, setGameSessionId] = useState(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [computerSecondsElapsed, setComputerSecondsElapsed] = useState(0);

  // Race state
  const [invalidCells, setInvalidCells] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [computerHasWon, setComputerHasWon] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isGameActive, setIsGameActive] = useState(false);

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

  function isBoardComplete(board) {
    return board.every((row) => row.every((cell) => cell !== ""));
  }

  function getNumberCounts(board) {
    const counts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };

    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell >= 1 && cell <= 9) {
          counts[cell] += 1;
        }
      });
    });

    return counts;
  }

  // Player keyboard input
  useEffect(() => {
    function handleKeyDown(event) {
      if (!selectedCell || winner) return;

      const { row, col } = selectedCell;
      const isGiven =
        givenBoard?.[row]?.[col] !== "" && givenBoard?.[row]?.[col] != null;

      if (isGiven) return;

      if (event.key >= "1" && event.key <= "9") {
        setPlayerBoard((prevBoard) => {
          const newBoard = copyBoard(prevBoard);
          newBoard[row][col] = Number(event.key);

          setInvalidCells(getInvalidCells(newBoard));
          return newBoard;
        });
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        setPlayerBoard((prevBoard) => {
          const newBoard = copyBoard(prevBoard);
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
  }, [selectedCell, givenBoard, winner]);

  // Player win detection
  useEffect(() => {
    const boardComplete = isBoardComplete(playerBoard);
    const boardValid = invalidCells.length === 0;
    const didWin = boardComplete && boardValid;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasWon(didWin);

    if (didWin) {
      setWinner((prevWinner) => prevWinner ?? "player");
    }
  }, [playerBoard, invalidCells]);

  // Player timer
  useEffect(() => {
    if (!gameSessionId || winner) return;

    const intervalId = setInterval(() => {
      setSecondsElapsed((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [gameSessionId, winner]);

  useEffect(() => {
  if (!isGameActive || winner) return;

  const intervalId = setInterval(() => {
    setComputerSecondsElapsed((prevSeconds) => prevSeconds + 1);
  }, 1000);

  return () => {
    clearInterval(intervalId);
  };
}, [isGameActive, winner]);

  // Computer move loop
  useEffect(() => {
    if (!isGameActive || winner || solutionBoard.length === 0) return;

    const intervalId = setInterval(() => {
      setComputerBoard((prevBoard) => {
        const newBoard = copyBoard(prevBoard);
        const emptyCells = [];

        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            if (newBoard[row][col] === "") {
              emptyCells.push({ row, col });
            }
          }
        }

        if (emptyCells.length === 0) return newBoard;

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const chosenCell = emptyCells[randomIndex];

        newBoard[chosenCell.row][chosenCell.col] =
          solutionBoard[chosenCell.row][chosenCell.col];

        return newBoard;
      });
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isGameActive, winner, solutionBoard]);

  // Computer win detection
  useEffect(() => {
    const boardComplete = isBoardComplete(computerBoard);
    const computerInvalidCells = getInvalidCells(computerBoard);
    const boardValid = computerInvalidCells.length === 0;
    const didWin = boardComplete && boardValid;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setComputerHasWon(didWin);

    if (didWin) {
      setWinner((prevWinner) => prevWinner ?? "computer");
    }
  }, [computerBoard]);

  // Stop game once there is a winner
  useEffect(() => {
    if (!winner) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsGameActive(false);
  }, [winner]);

  async function handleStartGame() {
    if (!selectedDifficulty) {
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
          difficulty: selectedDifficulty,
        }),
      });

      const data = await response.json();

      const normalizedBoard = normalizeBoard(data.current_board);
      const normalizedGivenBoard = normalizeBoard(data.puzzle.given_board);
      const normalizedSolutionBoard =
        data.puzzle.solution_board?.map((row) => {
          const filledRow = row.map((cell) => cell ?? "");

          while (filledRow.length < 9) {
            filledRow.push("");
          }

          return filledRow;
        }) || [];

      console.log("full puzzle data:", data.puzzle);
      console.log("normalizedBoard:", normalizedBoard);
      console.log(
        "row lengths:",
        normalizedBoard.map((row) => row.length)
      );
      console.log("board row count:", normalizedBoard.length);

      setGameSessionId(data.id);
      setPlayerBoard(copyBoard(normalizedBoard));
      setComputerBoard(copyBoard(normalizedBoard));
      setGivenBoard(normalizedGivenBoard);
      setSolutionBoard(normalizedSolutionBoard);

      setInvalidCells(getInvalidCells(normalizedBoard));
      setSelectedCell(null);
      setHasWon(false);
      setComputerHasWon(false);
      setWinner(null);
      setSecondsElapsed(0);
      setComputerSecondsElapsed(0);
      setIsGameActive(true);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  }

  const numberCounts = getNumberCounts(playerBoard);
  const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, "0");
  const seconds = String(secondsElapsed % 60).padStart(2, "0");
  const formattedTime = `${minutes}:${seconds}`;
  const computerMinutes = String(
  Math.floor(computerSecondsElapsed / 60)
).padStart(2, "0");

const computerSeconds = String(computerSecondsElapsed % 60).padStart(2, "0");

const formattedComputerTime = `${computerMinutes}:${computerSeconds}`;

  return (
    <main className="game-page">
      <section className="side-panel">
        <div className="panel-header">
          <h2>Player</h2>
          <div className="panel-stats">
            <span>⏱ {formattedTime}</span>
            <span>Wins: 0</span>
          </div>
        </div>

        <SudokuBoard
          board={playerBoard}
          givenBoard={givenBoard}
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
          invalidCells={invalidCells}
          hasWon={hasWon}
        />

        <div className="number-tracker">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <span
              key={number}
              className={
                numberCounts[number] === 9
                  ? "tracker-number complete"
                  : "tracker-number"
              }
            >
              {number}
            </span>
          ))}
        </div>
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

        {winner === "player" && <p className="win-message">You win!</p>}
        {winner === "computer" && <p className="win-message">Computer wins!</p>}
      </section>

      <section className="side-panel">
        <div className="panel-header">
          <h2>Computer</h2>
          <div className="panel-stats">
            <span>Wins: 0</span>
            <span>⏱ {formattedComputerTime}</span>
          </div>
        </div>

        <SudokuBoard
          board={computerBoard}
          givenBoard={givenBoard}
          selectedCell={null}
          setSelectedCell={() => {}}
          invalidCells={[]}
          hasWon={computerHasWon}
          isInteractive={false}
        />
      </section>
    </main>
  );
}