Feature: votes command

    Scenario: The votes command returns movie votes when there is one poll
        Given There is a poll
        When I execute the votes command
        Then I see all of the votes

    Scenario: The votes command returns movie votes when there are multiple polls
        Given There is are two polls
        When I execute the votes command
        Then I see all of the votes


    Scenario: The votes command returns movie votes in order of number of votes
        Given There is a poll
        When I execute the votes command
        Then I see the votes in order