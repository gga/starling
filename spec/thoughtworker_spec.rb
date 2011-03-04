require 'spec/spec_helper.rb'
require 'lib/thoughtworker'

shared_examples_for "thoughtworker with invalid attributes" do
  it "should not save" do
    expect {
      subject.save!
    }.to raise_error(ActiveRecord::RecordInvalid)
  end
end

describe ThoughtWorker do
  let(:subject) { ThoughtWorker.new(attributes) }
  let(:default_attributes) { { :name => "Fred", :human_address => "Nightcliff, NT", :latitude => "45.8", :longitude => "34", :country => "Brazil" } }

  context "with no attributes" do
    let(:attributes) { { } }
    it_should_behave_like "thoughtworker with invalid attributes"
  end

  context "with missing attributes" do
    [:name, :human_address, :latitude, :longitude, :country].each do |attr|
      let(:attributes) { default_attributes.merge(attr => nil) }

      it_should_behave_like "thoughtworker with invalid attributes"
    end
  end

  context "with non unique human address for name" do
    let(:attributes) { default_attributes }

    it "should not save" do
      ThoughtWorker.create!(attributes)
      expect {
        subject.save!
      }.to raise_error(ActiveRecord::RecordInvalid)
    end
  end
end
