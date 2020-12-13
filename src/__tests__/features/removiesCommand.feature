Feature: Removies command

    Scenario: Removies command wipes the single film in the film selection
        Given a film selection
        And the film selection has one film in it
        When the removies command is sent
        Then the film selection is reset

    Scenario: Removies command wipes multiple films in the film selection
        Given a film selection
        And the film selection has multiple films in it
        When the removies command is sent
        Then the film selection is reset
