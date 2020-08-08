class AddNextNodeStringToNodes < ActiveRecord::Migration[5.2]
  def change
  	remove_column :nodes, :next_node, :integer
    add_column :nodes, :next_node, :string
  end
end
