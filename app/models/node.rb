class Node < ApplicationRecord

	# after_create :set_current_number
	# after_update :set_current_number

	# def set_current_number
	# 	Node.skip_callback(:update, :after, :set_current_number, raise: false)
	# 	next_node = self.prev_node+2 if !self.last_node
	# 	self.update(current_number: current_number, next_node: next_node)
	# 	Node.set_callback(:update, :after, :set_current_number, raise: false)
	# end
end