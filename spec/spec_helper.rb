require 'rack/test'
require 'sinatra'
require 'active_record'
require 'rspec/mocks/standalone'

$: << File.dirname(__FILE__) + "/.."

require 'lib/env'
require 'spec/blueprints'

init(:test)
