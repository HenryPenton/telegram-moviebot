Feature: Movie poll command

    Scenario Outline: Minimum number of movies
        Given I have selected a <number> movies fewer than the minimum required
        When I send the moviepoll command
        Then I get a message saying "You must set at least two movies to be able to send out a poll"

        Examples:
            | number |
            | 0      |
            | 1      |


    Scenario Outline: Valid number of movies
        Given I have selected a <number> movies greater than the minimum required
        When I send the moviepoll command
        Then I receive a poll

        Examples:
            | number |
            | 2      |
            | 5      |
            | 10     |
