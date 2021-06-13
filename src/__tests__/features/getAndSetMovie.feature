Feature: Get and Set movies

    Scenario: Set a movie using the setmovieyear command
        Given A setmovieyear command
        When the command is executed
        Then the movie is set

    Scenario: Set a movie using the setmovieid command
        Given A setmovieid command
        When the command is executed
        Then the movie is set

    Scenario: Set two movies at once by name
        Given A setmultimovie command
        When the command is executed
        Then all of the movies are set

    Scenario: Set three movies at once by name
        Given A setmultimovie command
        When the command is executed
        Then all of the movies are set

    Scenario: Set three movies at once by name but one of the movies fails
        Given A setmultimovie command
        When the command is executed
        But one of the movie fetches fails
        Then two of the three movies are set

    Scenario: Set three movies at once by name but all fail
        Given A setmultimovie command
        When the command is executed
        But all of the movie fetches fail
        Then the message reads "Couldn't find those films"