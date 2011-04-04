# Commands to Run

Each of these is a command to run while following the tutorial around
Starling. Copy and paste in these commands at the appropriate points.

## Preparing Your Environment

Install Homebrew:

    ruby -e "$(curl -fsSL https://gist.github.com/raw/323731/install_homebrew.rb)"

## Getting the Code

    git clone https://gga@github.com/gga/starling.git

## Install RVM

    bash < <( curl http://rvm.beginrescueend.com/releases/rvm-install-head )

## Go Script

    #!/usr/bin/env bash
    bundle install
    rake verify
