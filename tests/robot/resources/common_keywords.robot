*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}     http://localhost:3000

*** Keywords ***
Open Browser To Login Page
    Open Browser    ${URL}/login.html    chrome
    Maximize Browser Window

Login As Student
    Open Browser To Login Page
    Input Text    id=username    student1
    Input Text    id=password    pass
    Click Button    xpath=//button[@type="submit"]
    Wait Until Page Contains Element    id=menu-container    timeout=5s