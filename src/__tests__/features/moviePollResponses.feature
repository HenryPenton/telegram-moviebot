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

    Scenario: A poll that has partial response falls over gracefully
        Given I have selected a number movies greater than the minimum
        When I send the moviepoll command
        But the response is only contains a poll id
        Then poll is not added to state

    Scenario: A poll gets added to state and wipes previous state
        Given I have selected a number movies greater than the minimum
        And I have previously sent a moviepoll command
        When I send the moviepoll command
        Then The poll gets added to state
        And It is the only thing in state
