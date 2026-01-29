class Users::SessionsController < Devise::SessionsController
  respond_to :json

  # POST /users/sign_in
  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)

    render json: {
      id: resource.id,
      email: resource.email
    }, status: :ok
  end

  # DELETE /users/sign_out
  def destroy
    sign_out(resource_name)
    head :no_content
  end
end
