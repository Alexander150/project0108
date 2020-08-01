class AddCurrentNumberToNode < ActiveRecord::Migration[5.2]
  def change
    add_column :nodes, :current_number, :integer
  end
end
