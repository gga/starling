namespace :testing do
  begin
    require 'rspec/core/rake_task'
    require 'cucumber'
    require 'cucumber/rake/task'
    require 'jasmine'

    RSpec::Core::RakeTask.new(:rspec) do |t|
      t.rspec_opts = "--color"
    end

    Cucumber::Rake::Task.new(:features) do |t|
      t.cucumber_opts = "features --format pretty"
    end

    load 'jasmine/tasks/jasmine.rake'

  rescue LoadError
    desc "Specs not available"
    task :spec

    desc "Features not available"
    task :features
  end

  task :prepare do
    ENV['RACK_ENV'] = 'test'
  end

  task :db_clean do
    rm_rf 'db/starling.test.db'
  end
end
task :spec => ['testing:prepare', 'testing:db_clean', :db, 'testing:rspec']
task :features => ['testing:prepare', 'testing:db_clean', :db, 'testing:features']
task :jspec => 'testing:jasmine:ci'

desc "Run all tests across the application"
task :verify => [:spec, :jspec, :features]

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

desc "Compiles the Haml to HTML to be served statically"
task :html => "haml/index.haml" do
  sh "haml --unix-newlines --format html5 haml/index.haml public/index.html"
end

desc "Compiles the SCSS to CSS to be served statically"
task :css do
  sh "compass compile . --sass-dir sass --css-dir public/stylesheets"
end

desc "Builds all the static assets"
task :build => [:html, :css]

desc "Runs locally"
task :local => [:db, :build] do
  sh "rackup -p 4567 --env development"
end

desc "Deploys the application with Capistrano"
task :deploy => :build do
  sh "cap backup"
  sh "cap deploy"
end

task :load => :environment do
  starting = ThoughtWorker.all
  (1500 / starting.length).to_i.times do
    starting.each { |s| ThoughtWorker.create!(s.attributes.merge(:latitude => rand(360) - 180, :longitude => rand(360) - 180)) }
  end
end

desc "Starts up watchr for starling"
task :watchr do
  system "watchr", "watchr.rb"
end
