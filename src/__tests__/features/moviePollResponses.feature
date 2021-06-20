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

    Scenario: A poll with a response that only has a poll id is not added to state
        Given I have selected a number movies greater than the minimum
        When I send the moviepoll command
        But the response is only contains a poll id
        Then poll is not added to state


    Scenario: A poll with a response that only has poll options is not added to state
        Given I have selected a number movies greater than the minimum
        When I send the moviepoll command
        But the response is only contains poll options
        Then poll is not added to state

    Scenario: A poll gets added to state and wipes previous state
        Given I have selected a number movies greater than the minimum
        And I have previously sent a moviepoll command
        When I send the moviepoll command
        Then The poll gets added to state
        And It is the only thing in state

    Scenario: A vote on a poll gets counted
        Given I have selected a number movies greater than the minimum
        And I have generated a moviepoll to vote on
        When I send a vote on a movie poll
        Then The poll gets updated in state

    Scenario: A vote on a poll doesnt get counted if no poll id
        Given I have selected a number movies greater than the minimum
        And I have generated a moviepoll to vote on
        When I send a vote on a movie poll
        But there is no poll id
        Then The poll vote doesnt get counted

    Scenario: A vote on a poll doesnt get counted if no poll options selected
        Given I have selected a number movies greater than the minimum
        And I have generated a moviepoll to vote on
        When I send a vote on a movie poll
        But there are no poll options
        Then The poll vote doesnt get counted

    Scenario: A vote on a poll doesnt get counted if the poll id doesnt match one in state
        Given I have selected a number movies greater than the minimum
        And I have generated a moviepoll to vote on
        When I send a vote on a movie poll
        Then The poll vote doesnt get counted

