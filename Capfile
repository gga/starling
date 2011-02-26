load 'deploy' if respond_to?(:namespace) # cap2 differentiator

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

after 'deploy:update' do
  run "cd #{current_path} && bundle install --deployment --local --without='test development'"
end

after :deploy do
  run "touch #{current_path}/tmp/restart.txt"
end
