class AddNameToPuzzles < ActiveRecord::Migration[8.0]
  def change
    add_column :puzzles, :name, :string
  end
end
