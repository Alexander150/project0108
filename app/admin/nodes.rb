ActiveAdmin.register Node do
actions :all, :except => [:destroy]
  menu label: "Узлы"
  permit_params :name, :description, :next_node, :prev_node, :first_node, :last_node,
                :current_number

  index do
    id_column
    column "Название", :name
    column "Описание", :description
    column "Предыдущий узел", :prev_node
    column "Данный узел", :current_number
    column "Следущий узел", :next_node
    column "Первый узел", :first_node
    column "Последний узел", :last_node
    actions
  end

  form do |f|
    f.actions
    f.inputs do
      f.input :name, label: "Название"
      f.input :description, label: "Описание"
      f.input :prev_node, label: "Предыдущий узел", as: :select, collection: Node.all.map{|n| ["#{n.id}, #{n.name}, #{n.description}"]}
      f.input :next_node, label: "Следущий узел", as: :select, collection: Node.all.map{|n| ["#{n.id}, #{n.name}, #{n.description}"]}
      f.input :first_node, label: "Первый узел"
      f.input :last_node, label: "Последний узел"
    end
  end

  # show do
  #   render "show_for_carousel_element"
  # end
end