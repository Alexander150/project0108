class NodesController < ApplicationController

	skip_before_action :verify_authenticity_token

	def index
	end

	def show
		@node = Node.find(params[:id])
	end

	def get_nodes_in_order
		@nodes = []
		@first_node = Node.find_by(first_node: true)
		@nodes.push(@first_node)
		Node.all.each do |n|
			if !n.first_node
				@nodes.push(n)
			end
		end
		render json: {nodes: @nodes}
	end

	def change
		all_nodes = Node.all
		node1 = Node.find(params[:id_1].split("_")[1])
		node2 = Node.find(params[:id_2].split("_")[1])

		prev_node_ids1 = []
		prev_node_ids2 = []
		prev_nodes1 = []
		prev_nodes2 = []

		next_node_ids1 = []
		next_node_ids2 = []
		next_node_ids1 = node1.next_node.split(";")
		next_node_ids2 = node2.next_node.split(";")

		all_nodes.each do |an|
			an.next_node.split(";").each do |x|
				if x.to_i == node1.id
					prev_node_ids1.push(an.id)
				end
				if x.to_i == node2.id
					prev_node_ids2.push(an.id)
				end
			end
		end

		# Нашли все предыдущие и следующие ноды для 1 и 2.

		if prev_node_ids1 != []
			prev_node_ids1.each do |pn1|
				node = Node.find(pn1)
				next_node = node.next_node.split(";").delete_if {|x| x.to_i == node1.id}
				node.update(next_node: next_node.join(";") + ";" + node2.id.to_s + ";")
			end
		end
		if prev_node_ids2 != []
			prev_node_ids2.each do |pn2|
				node = Node.find(pn2)
				next_node = node.next_node.split(";").delete_if {|x| x.to_i == node2.id}
				node.update(next_node: next_node.join(";") + ";" + node1.id.to_s + ";")
			end
		end

		# Обновили все предыдущие ноды.

		next_nodes_for_first_node = next_node_ids1
		next_nodes_for_second_node = next_node_ids2

		next_node_ids1.delete_if {|x| x == node2.id}
		next_node_ids2.delete_if {|x| x == node1.id}

		# Если 1 нод содежит ссылку на 2 нод, то удаляем ее. Аналогично для 2 нода.

		node1.update(next_node: next_node_ids2.join(";"))
		node2.update(next_node: next_node_ids1.join(";"))

		# Обновили 1 и 2 нод

		if next_nodes_for_first_node.include? (node2.id)
			node2.update(next_node: node2.next_node + node1.id.to_s + ";")
		end

		if next_nodes_for_second_node.include? (node1.id)
			node1.update(next_node: node1.next_node + node2.id.to_s + ";")
		end

		# Если 1 нод содержал ссылку на 2 нод, то добавляем 2 ноду ссылку на 1 нод. Аналогично для 2 нода.

		if node1.first_node
			node1.update(first_node: false)
			node2.update(first_node: true)
		elsif node2.first_node
			node1.update(first_node: true)
			node2.update(first_node: false)
		end
		render json: {answer: true}
	end

end
