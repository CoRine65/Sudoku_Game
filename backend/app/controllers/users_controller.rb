class UsersController < ApplicationController
  before_action :authenticate_user!

  def me
    render json: {
      id: current_user.id,
      email: current_user.email,
      created_at: current_user.created_at
    }
  end
end
