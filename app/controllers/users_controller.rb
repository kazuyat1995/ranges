class UsersController < ApplicationController
  def index
    @users = User.all

    return nil if params[:keyword] == ""
    @users = User.where(['name LIKE ?', "%#{params[:keyword]}%"] ).where.not(id: current_user.id).limit(10)
    respond_to do |format|
      format.html
      format.json
    end
  end

  # データを閲覧する画面を表示するためのAction
  def show
  end
  # データを作成する画面を表示するためのAction
  def new
  @user = User.new
  end

  def edit
  end

  # データを作成するためのAction
  def create
    @user = User.new(user_params)
    @user.save
    redirect_to @user
  end

  def update
    if current_user.update(user_params)
      redirect_to root_path
    else
      render :edit
    end
  end

  # データを削除するためのAction
  def destroy
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end
end
