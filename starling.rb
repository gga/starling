require 'sinatra'
require 'logger'
require 'haml'
require 'sass'
require 'active_record'

require 'lib/thoughtworker'

configure do
  LOGGER = Logger.new("sinatra.log") 

  ActiveRecord::Base.establish_connection(:adapter => 'sqlite3',
                                          :database => 'db/starling.db')
end
 
helpers do
  def logger
    LOGGER
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
  all_twer = ThoughtWorker.all.collect do |twer|
    logger.debug twer.inspect
    {
      'name' => twer.name,
      'latitude' => twer.latitude,
      'longitude' => twer.longitude,
      'html' => haml(:twer, :locals => { :twer => twer })
    }
  end
  all_twer.to_json
end

get '/twer/:id' do |twer_id|
  twer = ThoughtWorker.find twer_id
  haml :twer, :locals => { :twer => twer }
end

post '/nest' do
  request.body.rewind
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
