begin
  require 'rspec/core/rake_task'
  require 'cucumber'
  require 'cucumber/rake/task'

  RSpec::Core::RakeTask.new(:spec) do |t|
    t.rspec_opts = "--color"
  end

  Cucumber::Rake::Task.new(:features) do |t|
    t.cucumber_opts = "features --format pretty"
  end

rescue LoadError
  desc "Specs not available"
  task :spec

  desc "Features not available"
  task :features
end

namespace :testing do
  task :prepare do
    ENV['RACK_ENV'] = 'test'
  end

  task :db_clean do
    rm_rf 'db/starling.test.db'
  end
end
task :spec => ['testing:prepare', 'testing:db_clean', :db]
task :features => ['testing:prepare', 'testing:db_clean', :db]

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

desc "Runs locally"
task :local => :db do
  sh "rackup -p 4567 --env development"
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
