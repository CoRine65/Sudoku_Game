class GameSession < ApplicationRecord
  belongs_to :user
  belongs_to :puzzle
  has_many :moves
end
