# Generated by cucumber-sinatra. (Sat Mar 05 19:58:34 +1100 2011)

ENV['RACK_ENV'] = 'test'

require File.join(File.dirname(__FILE__), '..', '..', 'starling.rb')

require 'capybara'
require 'capybara/cucumber'
require 'rspec'

Capybara.app = Starling
Capybara.javascript_driver = :selenium

class StarlingWorld
  include Capybara
  include RSpec::Expectations
  include RSpec::Matchers
end

World do
  StarlingWorld.new
end