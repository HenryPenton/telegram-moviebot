Feature: Non existent command

    Make sure non existent/invalid commands do nothing

    Scenario: Regular message
        When a regular message is sent
        Then There should be no response

    Scenario Outline: Non existent commands
        When a non existent command of varying number of <words> is sent
        Then there should be no response
        Examples:
            | words     |
            |           |
            | one       |
            | two words |

    Scenario: Invalid message
        When a message is sent with a missing chat_id
        Then there should be no response