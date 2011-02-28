task :environment do
  require 'sinatra'
  require 'logger'
  require 'lib/env'
  require 'lib/thoughtworker.rb'

  init
end

desc "Ensures the database exists and is up to date."
task :db => :environment do
  ActiveRecord::Base.logger = Logger.new(STDOUT)
  ActiveRecord::Migration.verbose = true
  ActiveRecord::Migrator.migrate("db/migrations")
end

task :load => :environment do
  starting = ThoughtWorker.all
  (1500 / starting.length).to_i.times do
    starting.each { |s| ThoughtWorker.create!(s.attributes) }
  end
end
