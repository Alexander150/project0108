class CreateNodes < ActiveRecord::Migration[5.2]
  def change
    create_table :nodes do |t|
      t.string :name
      t.text :description
      t.integer :next_node
      t.integer :prev_node
      t.boolean :first_node
      t.boolean :last_node

      t.timestamps
    end
  end
end
