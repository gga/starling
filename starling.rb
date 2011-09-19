require 'sinatra/base'
require 'logger'
require 'haml'
require 'sass'
require 'active_record'

require 'lib/env'
require 'lib/thoughtworker'

class Starling < Sinatra::Base

  configure do
    LOGGER = Logger.new("sinatra.log") 

    set :public, File.dirname(__FILE__) + '/public'
    enable :methodoverride

    init settings.environment
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

  get '/twer' do
    content_type :json
    ThoughtWorker.all.collect { |twer| thoughtworker(twer) }.to_json
  end

  get '/twer/:id' do |twer_id|
    begin
      content_type :json
      thoughtworker(ThoughtWorker.find(twer_id.to_i)).to_json
    rescue ActiveRecord::RecordNotFound
      not_found
    end
  end

  delete '/twer/:id' do |twer_id|
    begin
      ThoughtWorker.delete(twer_id.to_i)
    rescue ActiveRecord::RecordNotFound
      not_found
    end
  end

  post '/nest' do
    begin
      twer = ThoughtWorker.create!(:name => params[:name],
                                   :human_address => params[:human_address],
                                   :latitude => params[:latitude],
                                   :longitude => params[:longitude],
                                   :country => params[:country])
      redirect "/twer/#{twer.id}"
    rescue ActiveRecord::RecordInvalid
      400
    end
  end

end
