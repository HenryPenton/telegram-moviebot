Feature: Removie command

    Background: film selection
        Given a film selection

    Scenario Outline: Remove a movie by id
        Given the selection has any <number> of movies in it
        When the removie <id> command is sent
        Then the film with at position <id> in the selection is removed

        Examples:
            | number | id |
            | 1      | 1  |
            | 2      | 1  |
            | 3      | 2  |
            | 4      | 2  |
            | 5      | 5  |

    Scenario: Remove movie by name
        Given the selection has a movie in it
        When the removie command is sent with the name of the film
        Then the film is removed

    Scenario Outline: Id/name that doesnt relate to a movie
        Given the selection has a movie in it
        When the removie command is sent with an <idOrName> that doesnt relate to a movie
        Then nothing is removed from the film selection
        Examples:
            | idOrName                |
            | -1                      |
            | random_non_numerical_id |