require 'rspec/core/rake_task'

RSpec::Core::RakeTask.new(:spec) do |t|
  t.rspec_opts = "--color"
end

namespace :spec do
  task :prepare do
    ENV['RACK_ENV'] = 'test'
  end

  task :db_clean do
    rm_rf 'db/starling.test.db'
  end
end
task :spec => ['spec:prepare', 'spec:db_clean', :db]

task :environment do
  require 'sinatra'
  require 'logger'
  require 'lib/env'
  require 'lib/thoughtworker.rb'

  init(ENV['RACK_ENV'] || 'development')
end

desc "Ensures the database exists and is up to date."
task :db => :environment do
  ActiveRecord::Base.logger = Logger.new(STDOUT)
  ActiveRecord::Migration.verbose = true
  ActiveRecord::Migrator.migrate("db/migrations")
end

desc "Deploys the application with Capistrano"
task :deploy do
  sh "cap backup"
  sh "cap deploy"
end

task :load => :environment do
  starting = ThoughtWorker.all
  (1500 / starting.length).to_i.times do
    starting.each { |s| ThoughtWorker.create!(s.attributes.merge(:latitude => rand(360) - 180, :longitude => rand(360) - 180)) }
  end
end
