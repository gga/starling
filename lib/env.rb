require 'active_record'

def init
  ActiveRecord::Base.establish_connection(:adapter => 'sqlite3',
                                          :database => 'db/starling.db')
end
