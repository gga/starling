require 'rack/test'
require 'sinatra'
require 'active_record'

$: << File.dirname(__FILE__) + "/.."

require 'lib/env'

init(:test)
