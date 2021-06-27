Feature: Set movies

    Scenario: Set a movie using the setmovie command
        Given A setmovie command
        When the command is executed
        Then the movie is set

    Scenario: Set a movie with ratings from a different source using the setmovie command
        Given A setmovie command
        And the movie has ratings from a source other than the most common
        When the command is executed
        Then the movie is set
        And the ratings are displayed correctly

    Scenario: Set a movie with no ratings
        Given A setmovie command
        And the movie has no ratings
        When the command is executed
        Then the movie is set
        And no ratings are displayed

    Scenario: Set a movie using the setmovieyear command
        Given A setmovieyear command
        When the command is executed
        Then the movie is set

    Scenario: Set a movie using the setmovieid command
        Given A setmovieid command
        When the command is executed
        Then the movie is set

    Scenario: Set two movies at once by name
        Given A setmovie command with two film separated by %%
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

    Scenario: Movie without title returns unknown movie
        Given A setmovie command
        When the command is executed
        But the response has no title
        Then the message reads "Couldn't find that film"

    Scenario: Movie that doesnt exist in the database isnt set
        Given A setmovie command
        When the command is executed
        But the movie doesnt exist in the database
        Then the message reads "Couldn't find that film"

    Scenario: Movie with blank ratings array returns no ratings
        Given A setmovie command
        When the command is executed
        But the movie has a blank ratings array
        Then the set movie has no ratings associated with it