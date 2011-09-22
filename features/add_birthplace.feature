Feature: Add a birthplace
  As a ThoughtWorker
  I want other ThoughtWorkers to know where I was born
  So that they see me as a fellow human.

  @javascript
  Scenario: Load the home page, and know where I am
    When I go to the home page
    Then I should see "project starling"

  @javascript
  Scenario: Attempt to add my birthplace, making some simple mistakes as I go
    Given I am on the home page
    When  I press "Pin Me!"
    Then  I should see "Did you fill in all the fields?"
    When  I follow "Try again?" within "#bad-request"
    And   I fill in "Name:" with "Giles Alexander"
    And   I press "Pin Me!"
    Then  I should see "Did you fill in all the fields?"
    When  I follow "Try again?" within "#bad-request"
    Then  the "Name:" field should contain "Giles Alexander"
    When  I fill in "Born in:" with "Welfsfsdfsd"
    And   I press "Pin Me!"
    Then  I should see "Couldn't find Welfsfsdfsd"
    When  I follow "Try again?" within "#not-found"
    Then  the "Name:" field should contain "Giles Alexander"
    And   the "Born in:" field should contain "Welfsfsdfsd"
    When  I fill in "Born in:" with "Wellington, NZ"
    And   I press "Pin Me!"
    Then  I should see "Did you fill in all the fields?"
    When  I follow "Try again?" within "#bad-request"
    Then  the "Name:" field should contain "Giles Alexander"
    And   the "Born in:" field should contain "Wellington, NZ"
    When  I select "Australia" from "country"
    And   I press "Pin Me!"
    Then  I should see "Thanks for telling us where you nested."
    When  I follow "No worries."
    And   I press "Pin Me!"
    Then  I should see "Or have you already pinned yourself?"
