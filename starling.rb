require 'sinatra'
require 'haml'
require 'sass'

get '/' do
  haml :index
end

get '/stylesheet.css' do
  scss :stylesheet
end
