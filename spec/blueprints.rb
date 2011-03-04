require 'machinist/active_record'
require 'sham'
require 'faker'

require 'lib/thoughtworker'

Sham.name { Faker::Name.name }
Sham.address { "#{Faker::Address.city}, #{Faker::Address.country}" }
Sham.country { Faker::Address.country }

ThoughtWorker.blueprint do
  name { Sham.name }
  human_address { Sham.address }
  latitude { "-45.8" }
  longitude { "105.7" }
  country { Sham.country }
end
