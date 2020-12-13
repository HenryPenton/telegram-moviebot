Feature: Movie command

Scenario: Getting a movie with info
    Given an incoming message prefixed with movie
    And the movie response has a title and other information about the film
    And there is a trailer for the film
    When the command is executed
    Then the response should contain the title, information and trailer
    
    