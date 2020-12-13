Feature: Movie command

    Scenario: Getting a movie with info
        Given an incoming message prefixed with movie
        And the movie response has a title and other information about the film
        And there is no trailer for the film
        When the command is executed
        Then the response should contain the title and information

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
