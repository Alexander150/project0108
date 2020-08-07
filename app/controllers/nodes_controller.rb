class NodesController < ApplicationController

	skip_before_action :verify_authenticity_token

	def index
		# @nodes = []
		# @first_node = Node.find_by(first_node: true)
		# @nodes.push(@first_node)
		# current_node = @first_node
		# for n in 1..Node.all.length-1
		# 	next_node_id = current_node.next_node
		# 	current_node = Node.find(next_node_id)
		# 	@nodes.push(current_node)
		# end
	end

	def get_nodes_in_order
		@nodes = []
		@first_node = Node.find_by(first_node: true)
		@nodes.push(@first_node)
		current_node = @first_node
		for n in 1..Node.all.length-1
			next_node_id = current_node.next_node
			current_node = Node.find(next_node_id)
			@nodes.push(current_node)
		end
		render json: {nodes: @nodes}
	end

	def show
		@node = Node.find(params[:id])
	end

	def change
		node1 = Node.find(params[:id_1].split("_")[1].to_i)
		node2 = Node.find(params[:id_2].split("_")[1].to_i)

		prev_node1 = nil
		next_node1 = nil
		prev_node2 = nil
		next_node2 = nil

		prev_node1_id = nil
		next_node1_id = nil
		prev_node2_id = nil
		next_node2_id = nil

		prev_node1 = Node.find(node1.prev_node) if !node1.prev_node.nil?
		next_node1 = Node.find(node1.next_node) if !node1.next_node.nil?
		prev_node2 = Node.find(node2.prev_node) if !node2.prev_node.nil?
		next_node2 = Node.find(node2.next_node) if !node2.next_node.nil?

		prev_node1_id = prev_node1.id if !prev_node1.nil?
		next_node1_id = next_node1.id if !next_node1.nil?
		prev_node2_id = prev_node2.id if !prev_node2.nil?
		next_node2_id = next_node2.id if !next_node2.nil?

		node1.update(prev_node: prev_node2_id, next_node: next_node2_id)
		node2.update(prev_node: prev_node1_id, next_node: next_node1_id)

		prev_node1.update(next_node: node2.id) if !prev_node1.nil?
		next_node1.update(prev_node: node2.id) if !next_node1.nil?
		prev_node2.update(next_node: node1.id) if !prev_node2.nil?
		next_node2.update(prev_node: node1.id) if !next_node2.nil?

		if node1.prev_node.nil?
			node1.update(first_node: true)
		else
			node1.update(first_node: false)
		end
		if node1.next_node.nil?
			node1.update(last_node: true)
		else
			node1.update(last_node: false)
		end
		if node2.prev_node.nil?
			node2.update(first_node: true)
		else
			node2.update(first_node: false)
		end
		if node2.next_node.nil?
			node2.update(last_node: true)
		else
			node2.update(last_node: false)
		end
		render json: {answer: true}
	end

end
