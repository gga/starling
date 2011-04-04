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
    rake db
    rake verify

## Tests

Specs:

In `spec/office_spec.rb`:

    require 'spec/spec_helper'
    require 'lib/office'
    
    describe Office do
    
      subject { Office.all }
      
      it "should expose all 21 offices" do
        subject.should have(21).offices
      end
    
      it "should include a name and an address" do
        subject.each do |office|
          office.name.should_not be_blank
          office.address.should_not be_blank
        end
      end
    
      context "Australian cities" do
        ["Sydney", "Melbourne", "Perth", "Brisbane"].each do |aus_city|
          it "should include #{aus_city}" do
            subject.should be_any { |office| office.name == aus_city }
          end
        end
    
        it "should include an office on Collins St" do
          subject.should be_any { |office| office.address =~ /Collins St/ }
        end
      end
    
    end

In `spec/starling_spec.rb`, right before the final `end`:

      it "should return the names and addresses for offices" do
        Office.stub(:all).and_return([OpenStruct.new(:name => 'Wodonga', :address => '12 Main St')])
        get '/offices'
        last_response.should be_ok
        last_response.content_type.should == "application/json"
        offices = JSON.parse(last_response.body)
        offices.should have(1).office
        offices[0]["name"].should == "Wodonga"
        offices[0]["address"].should == "12 Main St"
      end

## Story Implementation

In `lib/office.rb`:

    require 'yaml'
    
    class Office
      def self.all
        office_data = YAML.load(IO.read(File.dirname(__FILE__) + "/../cities.yml"))
        office_data.collect { |off| Office.new(off['name'], off['address']) }
      end
    
      attr_reader :name, :address
    
      def initialize(name, address)
        @name, @address = name, address
      end
    
    end

In `starling.rb`, right after the final `require`:

    require 'lib/office'

In `starling.rb`, right before the final `end`:

      get '/offices' do
        content_type :json
        Office.all.collect { |o| { :name => o.name, :address => o.address } }.to_json
      end
