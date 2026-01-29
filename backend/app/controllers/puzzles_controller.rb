class PuzzlesController < ApplicationController
  before_action :authenticate_user!

  def index
    puzzles = Puzzle.select(:id, :difficulty, :created_at).order(created_at: :desc)

    render json: puzzles
  end

  def show
    puzzle = Puzzle.find(params[:id])

    render json: {
      id: puzzle.id,
      difficulty: puzzle.difficulty,
      given_board: puzzle.given_board
    }
  end
end
