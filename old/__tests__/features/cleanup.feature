Feature: Cleanup

    Scenario: Cleanup duplicate movies
        Given the selection has two of the same movie in it
        When the cleanup command is sent
        Then any duplicates in the selection are removed

    Scenario: Movies without an id
        Given the selection has multiple movies without ids
        When the cleanup command is sent
        Then nothing is removed