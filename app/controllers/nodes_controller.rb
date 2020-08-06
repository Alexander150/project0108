class NodesController < ApplicationController

	skip_before_action :verify_authenticity_token

	def index
		@nodes = []
		@first_node = Node.find_by(first_node: true)
		@nodes.push(@first_node)
		current_node = @first_node
		for n in 1..Node.all.length-1
			next_node_id = current_node.next_node
			current_node = Node.find(next_node_id)
			@nodes.push(current_node)
		end
	end

	def show
		@node = Node.find(params[:id])
	end

	def change
		node1 = Node.find(params[:id_1].split("_")[1].to_i)
		node2 = Node.find(params[:id_2].split("_")[1].to_i)
		if (!node1.first_node and !node1.last_node and !node2.first_node and ! node2.last_node)
			prev_node1 = Node.find(node1.prev_node)
			next_node1 = Node.find(node1.next_node)
			prev_node2 = Node.find(node2.prev_node)
			next_node2 = Node.find(node2.next_node)
			node1.update(prev_node: prev_node2.id, next_node: next_node2.id)
			node2.update(prev_node: prev_node1.id, next_node: next_node1.id)
			prev_node1.update(next_node: node2.id)
			next_node1.update(prev_node: node2.id)
			prev_node2.update(next_node: node1.id)
			next_node2.update(prev_node: node1.id)
		end
		render json: {answer: true}
	end

end
