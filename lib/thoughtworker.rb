class ThoughtWorker < ActiveRecord::Base
  validates_presence_of :name, :human_address, :latitude, :longitude, :country
  validates_uniqueness_of :human_address, :scope => :name
end
