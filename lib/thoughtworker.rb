class ThoughtWorker < ActiveRecord::Base
  validates_presence_of :name, :human_address, :latitude, :longitude, :country
end
