Feature: Non existent command

    Make sure non existent/invalid commands do nothing

    Scenario: Invalid command
        When an invalid command is sent
        Then There should be no response

    Scenario Outline: Non existent commands
        When a non existent command of varying number of <words> is sent
        Then there should be no response
        Examples:
            | words     |
            |           |
            | one       |
            | two words |