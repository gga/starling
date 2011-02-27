load 'deploy' if respond_to?(:namespace) # cap2 differentiator

require 'fileutils'

default_run_options[:pty] = true

set :user, 'giles_a'
set :use_sudo, false
set :domain, 'starling.overwatering.org'
set :application, 'starling'

# Deployment source and strategy
set :deploy_to, "/home/giles_a/starling.overwatering.org/"
set :deploy_via, :copy
set :scm, :none
set :repository, "."

server domain, :app, :web

before :deploy do
  FileUtils::rm_rf "vendor/bundle"
end

after 'deploy:update' do
  run "cd #{current_path} && /home/giles_a/.gems/bin/bundle install --deployment --local --without='test development'"
end

before 'deploy:restart' do
  run "rm #{current_path}/db/starling.db"
  run "ln -s /home/giles_a/db/starling.db #{current_path}/db/starling.db"
end

namespace :deploy do
  task :restart do
    run "touch #{current_path}/tmp/restart.txt"
  end
end
