class RemovePrevNodeFromNodes < ActiveRecord::Migration[5.2]
  def change
  	remove_column :nodes, :prev_node, :integer
  	remove_column :nodes, :last_node, :boolean
  end
end
