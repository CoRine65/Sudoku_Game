class Move < ApplicationRecord
  belongs_to :game_session

  ACTIONS = %w[set clear].freeze

  validates :row, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 9 }
  validates :col, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 9 }
  #validates :action, presence: true, inclusion: { in: ACTIONS }
  #validates :move_number, presence: true, numericality: { only_integer: true, greater_than: 0 }

  validate :value_matches_action
  validate :cannot_target_given_cell

  private

  def value_matches_action
    case action
    when "set"
      unless value.is_a?(Integer) && (1..9).include?(value)
        errors.add(:value, "must be an integer 1..9 when action is set")
      end
    when "clear"
      errors.add(:value, "must be nil when action is clear") unless value.nil?
    end
  end

  def cannot_target_given_cell
    return unless game_session&.puzzle&.given_board.is_a?(Array)

    given = game_session.puzzle.given_board
    return unless given.length == 9 && given.all? { |r| r.is_a?(Array) && r.length == 9 }
    return unless row.is_a?(Integer) && col.is_a?(Integer) && (0..8).cover?(row) && (0..8).cover?(col)

    locked_value = given[row][col]
    errors.add(:base, "cannot modify a given cell (row #{row}, col #{col})") unless locked_value.nil?
  end
end
