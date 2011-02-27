require 'sinatra'
require 'logger'
require 'haml'
require 'sass'
require 'active_record'

require 'lib/env'
require 'lib/thoughtworker'

configure do
  LOGGER = Logger.new("sinatra.log") 
  init
end
 
helpers do
  def logger
    LOGGER
  end

  def thoughtworker(twer)
    {
      'id' => twer.id,
      'name' => twer.name,
      'latitude' => twer.latitude,
      'longitude' => twer.longitude,
      'html' => haml(:twer, :locals => { :twer => twer })
    }
  end
end

get '/' do
  haml :index
end

get '/stylesheet.css' do
  scss :stylesheet
end

get '/twer' do
  content_type :json
  ThoughtWorker.all.collect { |twer| thoughtworker(twer) }.to_json
end

get '/twer/:id' do |twer_id|
  content_type :json
  thoughtworker(ThoughtWorker.find(twer_id)).to_json
end

delete '/twer/:id' do |twer_id|
  ThoughtWorker.delete(twer_id)
end

post '/nest' do
  twer = ThoughtWorker.new(:name => params[:name],
                           :human_address => params[:human_address],
                           :latitude => params[:latitude],
                           :longitude => params[:longitude])
  if twer.save
    redirect "/twer/#{twer.id}"
  else
    400
  end
end
