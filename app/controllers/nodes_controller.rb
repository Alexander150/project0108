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

		next_node1 = nil
		next_node2 = nil

		next_node1_id = nil
		next_node2_id = nil

		next_node1 = Node.find(node1.next_node) if !node1.next_node.nil?
		next_node2 = Node.find(node2.next_node) if !node2.next_node.nil?

		next_node1_id = next_node1.id if !next_node1.nil?
		next_node2_id = next_node2.id if !next_node2.nil?

		prev_node1 = Node.find_by(next_node: node1.id)
		prev_node1_will = node2.id
		prev_node2 = Node.find_by(next_node: node2.id)
		prev_node2_will = node1.id
		prev_node1.update(next_node: prev_node1_will) if !prev_node1.nil?
		prev_node2.update(next_node: prev_node2_will) if !prev_node2.nil?

		if (next_node1_id != node2.id and next_node2_id != node1.id)
			node1.update(next_node: next_node2_id)
			node2.update(next_node: next_node1_id)
		elsif (next_node1_id == node2.id and next_node2_id != node1.id)
			node1.update(next_node: next_node2_id)
			node2.update(next_node: node1.id)
		elsif (next_node1_id != node2.id and next_node2_id == node1.id)
			node1.update(next_node: node2.id)
			node2.update(next_node: next_node1_id)
		end

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
