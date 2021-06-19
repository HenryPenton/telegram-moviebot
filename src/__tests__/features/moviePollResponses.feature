Feature: Movie poll responses command

    Scenario: A poll gets added to state
        Given I have selected a number movies greater than the minimum
        When I send the moviepoll command
        Then The poll gets added to state


    Scenario: A poll that has no response falls over gracefully
        Given I have selected a number movies greater than the minimum
        When I send the moviepoll command
        But the response does not exist
        Then The command falls over gracefully