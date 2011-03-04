class CreateThoughtWorkerTable < ActiveRecord::Migration
  def self.up
    create_table :thought_workers do |t|
      t.string :name
      t.string :human_address
      t.string :latitude
      t.string :longitude
    end
  end

  def self.down
    drop_table :thought_workers
  end
end
