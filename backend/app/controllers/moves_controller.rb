class MovesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_game_session

  # GET 
  def index
    moves = @game_session.moves.order(created_at: :asc)

    render json: moves.map { |m| move_payload(m) }
  end

  # POST /
  def create
    row, col, value = move_params.values_at(:row, :col, :value)

    # 1) Validate ranges early
    unless (0..8).cover?(row) && (0..8).cover?(col)
      return render json: { error: "row/col must be between 0 and 8" }, status: :unprocessable_entity
    end

    unless (1..9).cover?(value)
      return render json: { error: "value must be between 1 and 9" }, status: :unprocessable_entity
    end

    # 2) Don’t allow edits to given cells
    given = @game_session.puzzle.given_board
    if given[row][col].to_i != 0
      return render json: { error: "That cell is locked (given by puzzle)" }, status: :unprocessable_entity
    end

    # 3) Apply move to current_board
    board = @game_session.current_board
    board[row][col] = value

    Move.transaction do
      move = @game_session.moves.create!(
        row: row,
        col: col,
        value: value
      )

      @game_session.update!(current_board: board)

      render json: {
        move: move_payload(move),
        game_session: show_payload(@game_session)
      }, status: :created
    end
  end

  private

  def set_game_session
   #scoping to current_user prevents “steal someone else’s session”
    @game_session = current_user.game_sessions.includes(:puzzle).find(params[:game_session_id])
  end

  def move_params
    params.require(:move).permit(:row, :col, :value)
  end

  def move_payload(move)
    {
      id: move.id,
      row: move.row,
      col: move.col,
      value: move.value,
      created_at: move.created_at
    }
  end

  # Reuse the same payload style in GameSessionsController
  def show_payload(session)
    {
      id: session.id,
      status: session.status,
      created_at: session.created_at,
      updated_at: session.updated_at,
      puzzle: {
        id: session.puzzle_id,
        difficulty: session.puzzle.difficulty,
        given_board: session.puzzle.given_board
      },
      current_board: session.current_board
    }
  end
end
