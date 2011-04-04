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
