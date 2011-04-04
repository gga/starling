require 'spec/spec_helper.rb'
require 'json'
require 'starling'

describe 'starling' do
  include Rack::Test::Methods

  before(:all) do
    Sinatra::Base.helpers do
      def haml(view, options = {})
        "rendering #{view}"
      end
    end
  end

  let(:app) { Starling.new }
  let(:attributes) { {
      :name => "Fred",
      :human_address => "Nightcliff, NT",
      :latitude => "45.8",
      :longitude => "34",
      :country => "Brazil" } }

  it "should render the index on a GET of /" do
    get '/'
    last_response.should be_ok
    last_response.body.should == "rendering index"
  end

  it "should return json for a ThoughtWorker on request" do
    twer = ThoughtWorker.make
    ThoughtWorker.stub(:find).and_return(twer)
    get '/twer/42'
    last_response.should be_ok
    last_response.content_type.should == "application/json"

    tw_data = JSON.parse(last_response.body)
    tw_data["id"].should == twer.id
    tw_data["name"].should == twer.name
    tw_data["latitude"].should == twer.latitude
    tw_data["longitude"].should == twer.longitude
    tw_data["html"].should == "rendering twer"
  end

  it "should fail to return a thoughtworker for an invalid id" do
    ThoughtWorker.stub(:find).and_raise(ActiveRecord::RecordNotFound)
    get '/twer/42'
    last_response.should be_not_found
  end

  it "should collect together all known ThoughtWorkers" do
    all = [ThoughtWorker.make, ThoughtWorker.make, ThoughtWorker.make]
    ThoughtWorker.stub(:all).and_return(all)
    get '/twer'
    last_response.should be_ok
    last_response.content_type.should == "application/json"

    twers = JSON.parse(last_response.body)
    twers.should have(3).items
    twers.each_with_index do |t, i|
      t["id"].should == all[i].id
      t["name"].should == all[i].name
      t["latitude"].should == all[i].latitude
      t["longitude"].should == all[i].longitude
      t["html"].should == "rendering twer"
    end
  end

  it "should successfully return nothing when there are no ThoughtWorkers" do
    ThoughtWorker.stub(:all).and_return([])
    get '/twer'
    last_response.should be_ok
    last_response.content_type.should == "application/json"
    JSON.parse(last_response.body).should be_empty
  end
  
  it "should allow the deletion of a thoughtworker" do
    ThoughtWorker.should_receive(:delete).with(42)
    delete '/twer/42'
    last_response.should be_ok
  end

  it "should fail with a 404 when the thoughtworker doesn't exist" do
    ThoughtWorker.stub(:delete).and_raise(ActiveRecord::RecordNotFound)
    delete '/twer/42'
    last_response.should be_not_found
  end

  it "should create a ThoughtWorker and redirect to that resource on post" do
    twer = mock('thoughtworker')
    twer.stub(:id).and_return(42)
    ThoughtWorker.stub(:create!).and_return(twer)
    post '/nest', attributes
    last_response.should be_redirect
    last_response.location.should == "http://example.org/twer/42"
  end

  it "should fail with a 400 when the data is not provided correctly" do
    ThoughtWorker.stub(:create!).and_raise(ActiveRecord::RecordInvalid.new(ThoughtWorker.new))
    post '/nest', attributes
    last_response.status.should == 400
  end

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
end
