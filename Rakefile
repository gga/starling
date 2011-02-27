task :environment do
  require 'sinatra'
  require 'logger'
  require 'lib/env'
  init
end

desc "Ensures the database exists and is up to date."
task :db => :environment do
  ActiveRecord::Base.logger = Logger.new(STDOUT)
  ActiveRecord::Migration.verbose = true
  ActiveRecord::Migrator.migrate("db/migrations")
end
