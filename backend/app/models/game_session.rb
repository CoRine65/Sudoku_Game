class GameSession < ApplicationRecord
  belongs_to :user
  belongs_to :puzzle
  has_many :moves

  STATUSES = %w[in_progress completed].freeze

  validates :status, presence: true, inclusion: { in: STATUSES }
  validates :current_board, presence: true

  validate :current_board_is_9x9
  validate :current_board_has_valid_values
  validate :current_board_respects_given_cells

  private

  def current_board_is_9x9
    board = current_board
    unless board.is_a?(Array) && board.length == 9 && board.all? { |row| row.is_a?(Array) && row.length == 9 }
      errors.add(:current_board, "must be a 9x9 array")
    end
  end

  def current_board_has_valid_values
    return unless current_board.is_a?(Array)
    current_board.flatten.each do |v|
      next if v.nil?
      errors.add(:current_board, "values must be nil or integers 1..9") unless v.is_a?(Integer) && (1..9).include?(v)
    end
  end

  def current_board_respects_given_cells
    return unless boards_look_9x9?

    given = puzzle.given_board
    9.times do |r|
      9.times do |c|
        gv = given[r][c]
        next if gv.nil?
        cv = current_board[r][c]
        errors.add(:current_board, "cannot change given cell at row #{r}, col #{c}") unless cv == gv
      end
    end
  end

  def boards_look_9x9?
    b = current_board
    g = puzzle&.given_board
    [b, g].all? do |board|
      board.is_a?(Array) && board.length == 9 && board.all? { |row| row.is_a?(Array) && row.length == 9 }
    end
  end
end
