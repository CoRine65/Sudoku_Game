class GameSessionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_game_session, only: [:show, :update]

  # GET /game_sessions
  def index
    sessions = current_user.game_sessions
                           .includes(:puzzle)
                           .order(updated_at: :desc)

    render json: sessions.map { |s| index_payload(s) }
  end

  # GET /game_sessions/:id
  def show
    render json: show_payload(@game_session)
  end

  def create
    puzzle = Puzzle.find(params.require(:puzzle_id))

    game_session = current_user.game_sessions.create!(
      puzzle: puzzle,
      status: "in_progress",
      current_board: puzzle.given_board
    )

    render json: show_payload(game_session), status: :created
  end


  def update
    @game_session.update!(update_params)
    render json: show_payload(@game_session)
  end

  private

  def set_game_session
    @game_session = current_user.game_sessions.find(params[:id])
  end

  def update_params
    params.require(:game_session).permit(:status)
  end

  def index_payload(session)
    {
      id: session.id,
      status: session.status,
      updated_at: session.updated_at,
      puzzle: {
        id: session.puzzle_id,
        difficulty: session.puzzle.difficulty
      }
    }
  end

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
