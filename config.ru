require 'rubygems'

set :run, false
set :environment, :production

require 'starling'

run Sinatra::Application
