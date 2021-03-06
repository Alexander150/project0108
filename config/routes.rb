Rails.application.routes.draw do
  	devise_for :admin_users, ActiveAdmin::Devise.config
  	ActiveAdmin.routes(self)
  	# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  	root 'nodes#index'

  	get 'node/:id', to: 'nodes#show'

  	post 'nodes/change', to: 'nodes#change'
  	get 'nodes/get_nodes_in_order', to: 'nodes#get_nodes_in_order'
end
