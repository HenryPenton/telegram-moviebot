Feature: help command

    Scenario: Help returns the list of commands
        When I execute the help command
        Then I see all of the commands
