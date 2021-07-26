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


    Scenario Outline: Movies larger than telegram limit
        Given I have selected a <number> movies greater than the telegram limit
        When I send the moviepoll command
        Then I receive as many polls as needed

        Examples:
            | number |
            | 11     |
            | 21     |
            | 31     |

    Scenario: Only unique movies are sent
        Given I have selected three movies
        But two of them are duplicates
        When I send the moviepoll command
        Then I receive a poll with the two unique movies

    Scenario Outline: Sending one movie over the limit doesn't trigger minimum poll size error for the second poll
        Given I have selected <selected> movies
        But the telegram limit is one less than that
        When I send the moviepoll command
        Then I receive two polls
        And they have lengths <firstPollLength> and <secondPollLength>

        Examples:
            | selected | firstPollLength | secondPollLength |
            | 11       | 9               | 2                |
