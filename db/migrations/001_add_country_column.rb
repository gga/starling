class AddCountryColumn < ActiveRecord::Migration
  def self.up
    add_column :thought_workers, :country, :string, :default => "Australia"
  end

  def self.down
    remove_column :thought_workers, :country
  end
end
