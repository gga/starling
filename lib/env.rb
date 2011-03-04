require 'active_record'

def init(environment)
  ActiveRecord::Base.establish_connection(:adapter => 'sqlite3',
                                          :database => "db/starling.#{environment}.db")
end
