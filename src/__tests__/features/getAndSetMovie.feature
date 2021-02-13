Feature: Get and Set movies

    Scenario: Set a movie using the setmovieyear command
    Given A setmovieyear command
    When the command is executed
    Then the movie is set