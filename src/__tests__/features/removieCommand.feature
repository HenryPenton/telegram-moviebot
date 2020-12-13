Feature: Removie command


    Scenario Outline: Remove a movie by id
        Given a film selection
        And the selection has any <number> of movies in it
        When the removie command is sent
        Then the film with at position <id> in the selection is removed

        Examples:
            | number | id |
            | 1      | 1  |
            | 2      | 1  |
            | 3      | 2  |
            | 4      | 2  |
            | 5      | 5  |
