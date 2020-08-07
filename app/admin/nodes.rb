ActiveAdmin.register Node do
  menu label: "Узлы"
  permit_params :name, :description, :next_node, :first_node

  index do
    id_column
    column "Название", :name
    column "Описание", :description
    column "Следущий узел", :next_node
    column "Первый узел", :first_node
    actions
  end

  form do |f|
    f.actions
    f.inputs do
      f.input :name, label: "Название"
      f.input :description, label: "Описание"
      f.input :next_node, label: "Следущий узел", as: :select, collection: Node.all.map{|n| ["#{n.id}, #{n.name}, #{n.description}"]}
      f.input :first_node, label: "Первый узел"
    end
  end

  # show do
  #   render "show_for_carousel_element"
  # end
end