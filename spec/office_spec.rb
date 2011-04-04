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
