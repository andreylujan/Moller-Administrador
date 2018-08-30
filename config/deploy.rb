# config valid only for current version of Capistrano
# lock '3.7.1'
lock '3.11.0'

set :application, 'admin'
set :repo_url, 'git@github.com:andreylujan/Moller-Administrador.git'
set :branch, 'master'

#set :ssh_options, {
# keys: [ "#{ENV['HOME']}/.ssh/echeckit_production.pem", "./keys/echeckit_production.pem" ],
# forward_agent: true,
# auth_methods: ["publickey"]
#}

# Default value for :scm is :git
set :scm, :git

set :deploy_via, :remote_cache

set :scm_verbose, true

set :use_sudo, false

set :shallow_clone, 1

# Default value for :format is :pretty
set :format, :pretty

# Default value for :log_level is :debug
set :log_level, :info

# Default value for :pty is false
set :pty, false


set :bundle_roles, :all                                  # this is default
set :bundle_binstubs, nil     # Rails 4 generates executables
set :bundle_gemfile, -> { release_path.join('Gemfile') } # default: nil
set :bundle_path, -> { shared_path.join('bundle') }      # this is default
set :bundle_without, %w{development test}.join(' ')      # this is default
set :bundle_flags, '--deployment --quiet'                # this is default
set :bundle_env_variables, {}                    # this is default

# set :npm_target_path, -> { release_path.join('node_modules') } # default not set
set :npm_flags, '' # default
set :npm_roles, :all                              # default
set :npm_env_variables, {}                        # default

# Default value for :linked_files is []
# set :linked_files, %w{.env}

# Default value for linked_dirs is []
set :linked_dirs, %w{log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system bower_components node_modules dist}

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
set :keep_releases, 5

set :rbenv_type, :user
set :rbenv_ruby, '2.4.1'
set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} RBENV_VERSION=#{fetch(:rbenv_ruby)} /home/plluch/.rbenv/bin/rbenv exec"
# set :rbenv_map_bins, %w{rake gem bundle ruby rails}
set :rbenv_roles, :all
set :rbenv_custom_path, '/home/plluch/.rbenv/bin/rbenv'


set :passenger_restart_with_sudo, false
set :grunt_tasks, 'build --force --verbose'

before 'deploy:updated', :grunt

namespace :deploy do

  # before :updated, :grunt_build do
  #     on roles(:web) do
  #         within release_path do
  #         execute :bundle, 'exec grunt build --verbose --force'
  #     end
  #   end
  # end

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

end
