class CreatePuzzles < ActiveRecord::Migration[8.0]
  def change
    create_table :puzzles do |t|
      t.string :difficulty
      t.jsonb :given_board
      t.jsonb :solution_board

      t.timestamps
    end
  end
end
