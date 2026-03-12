// src/pages/SudokuGamePage.jsx
import { useState } from "react";
import SudokuBoard from "../components/SudokuBoard";
import "./SudokuGamePage.css";

export default function SudokuGamePage() {
  // eslint-disable-next-line no-unused-vars
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
        setSelectedCell={setSelectedCell}/>
      </section>

      <section className="control-panel">
        <h2>Game Controls</h2>

        <div className="difficulty-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select id="difficulty" name="difficulty">
                <option value="">Choose difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
        </div>

        <button className="start-btn">Start Game</button>
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