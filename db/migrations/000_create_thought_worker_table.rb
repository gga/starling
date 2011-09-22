class CreateThoughtWorkerTable < ActiveRecord::Migration
  def self.up
    if not table_exists? :thought_workers
      create_table :thought_workers do |t|
        t.string :name
        t.string :human_address
        t.string :latitude
        t.string :longitude
      end
    end
  end

  def self.down
    drop_table :thought_workers
  end
end
