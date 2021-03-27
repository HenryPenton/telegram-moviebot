Feature: Movie command

    Scenario: Getting a movie with info
        Given an incoming message prefixed with movie
        And the movie response has a title and other information about the film
        And there is no trailer for the film
        When the command is executed
        Then the response should contain the title and information

    Scenario: Get a movie by title and Year
        Given a movie command with a year specified
        And there are two possible movies by title
        When the command is executed
        Then the response should be the movie that relates to the Year



    Scenario: Responding to an unavailable film when getting by title and year
        Given an incoming message prefixed with movieyear
        And the omdb is unvailable
        When the command is executed
        Then the response should say "Unknown movie"

    Scenario: Getting a movie with info and a trailer
        Given an incoming message prefixed with movie
        And the movie response has a title and other information about the film
        And there is a trailer for the film
        When the command is executed
        Then the response should contain the title, information and trailer

    Scenario: Responding to an unavailable film
        Given an incoming message prefixed with movie
        And the omdb is unvailable
        When the command is executed
        Then the response should say "Unknown movie"

    Scenario: Responding to an unavailable trailer
        Given an incoming message prefixed with movie
        And the movie response has a title and other information about the film
        And youtube is unvailable
        When the command is executed
        Then the response should contain the title and information

    Scenario: Responding to a movie where the title without a trailer is the only available information
        Given an incoming message prefixed with movie
        And there is only a title available for the film
        And there is no trailer for the film
        When the command is executed
        Then the response should contain the movie name only

    Scenario: Responding to a movie where the title with a trailer is the only available information
        Given an incoming message prefixed with movie
        And there is only a title available for the film
        And there is a trailer for the film
        When the command is executed
        Then the response should contain the movie name only

    Scenario: Responding to a movie where the title doesn't exist
        Given an incoming message prefixed with movie
        And there is no title available for the film
        When the command is executed
        Then the response should say "Unknown movie"