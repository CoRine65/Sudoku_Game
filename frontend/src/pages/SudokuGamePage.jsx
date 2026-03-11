// src/pages/SudokuGamePage.jsx
import SudokuBoard from "../components/SudokuBoard";
import "./SudokuGamePage.css";

export default function SudokuGamePage() {
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

        <SudokuBoard />
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