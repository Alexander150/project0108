class Node < ApplicationRecord

	after_update :after

	def after
		if self.next_node[0] == ";"
			self.update(next_node: self.next_node[1..self.next_node.length])
		end
		# if self.next_node[-1] == ';'
		# 	self.update(next_node: self.next_node[0..-1])
		# end
	end
end