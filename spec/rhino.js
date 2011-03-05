
load('/Users/galexand/.rvm/gems/ruby-1.8.7-p330@personal/gems/jspec-4.3.3/lib/jspec.js')
load('/Users/galexand/.rvm/gems/ruby-1.8.7-p330@personal/gems/jspec-4.3.3/lib/jspec.xhr.js')
load('lib/yourlib.js')
load('spec/unit/spec.helper.js')

JSpec
.exec('spec/unit/spec.js')
.run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures' })
.report()