require "json"

file_path = Rails.root.join("db", "seeds", "puzzles.json")
puzzles = JSON.parse(File.read(file_path))

puzzles.each do |p|
  puzzle = Puzzle.find_or_initialize_by(name: p.fetch("name"))

  puzzle.difficulty = p.fetch("difficulty")
  puzzle.given_board = p.fetch("given_board")
  puzzle.solution_board = p.fetch("solution_board")

  puzzle.save!
end