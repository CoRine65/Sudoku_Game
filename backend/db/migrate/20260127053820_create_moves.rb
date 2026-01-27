class CreateMoves < ActiveRecord::Migration[8.0]
  def change
    create_table :moves do |t|
      t.references :game_session, null: false, foreign_key: true
      t.integer :row
      t.integer :col
      t.integer :value
      t.integer :previous_value
      t.string :action
      t.integer :move_number

      t.timestamps
    end
  end
end
