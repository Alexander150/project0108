class NodesController < ApplicationController

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

end
