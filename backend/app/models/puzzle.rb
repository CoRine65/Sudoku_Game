class Puzzle < ApplicationRecord
  has_many :game_sessions

  DIFFICULTIES = %w[easy medium hard].freeze

  validates :difficulty, presence: true, inclusion: { in: DIFFICULTIES }
  validates :given_board, presence: true
  validates :solution_board, presence: true

  validate :boards_are_9x9
  validate :boards_have_valid_values
  validate :given_does_not_contradict_solution

  private

  def boards_are_9x9
    [given_board, solution_board].each_with_index do |board, idx|
      name = idx.zero? ? :given_board : :solution_board

      unless board.is_a?(Array) && board.length == 9 && board.all? { |row| row.is_a?(Array) && row.length == 9 }
        errors.add(name, "must be a 9x9 array")
      end
    end
  end

  def boards_have_valid_values
    return unless given_board.is_a?(Array) && solution_board.is_a?(Array)

    given_board.flatten.each do |v|
      next if v.nil?
      errors.add(:given_board, "values must be nil or integers 1..9") unless v.is_a?(Integer) && (1..9).include?(v)
    end

    solution_board.flatten.each do |v|
      errors.add(:solution_board, "must be fully filled with integers 1..9") unless v.is_a?(Integer) && (1..9).include?(v)
    end
  end

  def given_does_not_contradict_solution
    return unless boards_look_9x9?

    9.times do |r|
      9.times do |c|
        gv = given_board[r][c]
        sv = solution_board[r][c]
        next if gv.nil?
        errors.add(:given_board, "contradicts solution at row #{r}, col #{c}") unless gv == sv
      end
    end
  end

  def boards_look_9x9?
    [given_board, solution_board].all? do |board|
      board.is_a?(Array) && board.length == 9 && board.all? { |row| row.is_a?(Array) && row.length == 9 }
    end
  end
end
