Gem.clear_paths
ENV['GEM_HOME'] = '/home/giles_a/.gems'
ENV['GEM_PATH'] = "/home/.gems:#{ENV['GEM_PATH']}"

require 'rubygems'
require 'bundler'

Bundler.require

set :run, false
set :environment, :production

require 'starling'

run Starling
