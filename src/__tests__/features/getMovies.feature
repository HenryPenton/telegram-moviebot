Feature: Get movies

    Scenario: User is informed that no film has been set
        Given A getmovies command
        And the selection is blank
        When the command is executed
        Then The user sees the message "No movies have been set yet"


    Scenario: User shown a single film if one film is set
        Given A getmovies command
        And the selection has a single film in it
        When the command is executed
        Then The user sees the message "1. First film in selection"

    Scenario: User shown a multiple films if multiple have been set
        Given A getmovies command
        And the selection has two films in it
        When the command is executed
        Then The user sees a list containing both films
