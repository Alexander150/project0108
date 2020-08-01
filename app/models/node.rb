class Node < ApplicationRecord

	after_create :set_current_number
	after_update :set_current_number

	def set_current_number
		self.skip_callback(:update, :after, :set_current_number)
		current_number = self.next_node-1 if !self.last_node
		current_number = self.prev_node+1 if self.last_node
		p current_number
		self.update(current_number: current_number)
		self.skip_callback(:update, :after, :set_current_number)
	end
end