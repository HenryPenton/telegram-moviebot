Feature: Removies command

    Scenario: Reset command wipes the single film in the film selection
        Given a film selection
        And the film selection has one film in it
        When the reset command is sent
        Then the film selection is reset

    Scenario: Reset command wipes multiple films in the film selection
        Given a film selection
        And the film selection has multiple films in it
        When the reset command is sent
        Then the film selection is reset

    Scenario: Polls are wiped by the reset command
        Given a moviepoll
        When the reset command is sent
        Then poll is reset
