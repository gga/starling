require 'machinist/active_record'
require 'faker'

require 'lib/thoughtworker'

ThoughtWorker.blueprint do
  name { Faker::Name.name }
  human_address { "#{Faker::Address.city}, #{Faker::Address.country}" }
  latitude { "-45.8" }
  longitude { "105.7" }
  country { Faker::Address.country }
end
