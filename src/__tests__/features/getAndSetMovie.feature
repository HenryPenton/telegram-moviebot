Feature: Get and Set movies

    Scenario: Set a movie using the setmovieyear command
        Given A setmovieyear command
        When the command is executed
        Then the movie is set

    Scenario: Set a movie using the setmovieid command
        Given A setmovieid command
        When the command is executed
        Then the movie is set

    Scenario: Set multiple movies at once by name
        Given A setmultimovie command
        When the command is executed
        Then all of the movies are set