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

    Scenario: The votes command returns nothing when there are no votes
        Given There is a poll
        And I have retracted my votes
        When I execute the votes command
        Then I see a response telling me there are no votes

    Scenario: Retracting votes removes votes from the counter
        Given There is a poll
        And I have voted for at least one movie on the poll
        When I retract my votes
        Then The state is updated accordingly

    Scenario Outline: Voters listed correctly
        Given There is a poll
        And there are <voters> voters
        When I execute the votes command
        Then I see all of the votes with grammatically correct <voterusernames>

        Examples:
            | voters | voterusernames         |
            | 1      | HenryPenton            |
            | 2      | HenryPenton and JD     |
            | 3      | HenryPenton, JD and JL |