*** Settings ***
Library    SeleniumLibrary
Resource   resources/common_keywords.robot

*** Test Cases ***
Valid Student Login
    Open Browser To Login Page
    Input Text    id=username    student1
    Input Text    id=password    pass
    Click Button    xpath=//button[@type="submit"]
    Wait Until Page Contains Element    id=menu-container    timeout=5s
    [Teardown]    Close Browser

Invalid Login Shows Error
    Open Browser To Login Page
    Input Text    id=username    student1
    Input Text    id=password    wrongpass
    Click Button    xpath=//button[@type="submit"]
    Wait Until Element Is Visible    id=error-msg    timeout=5s
    [Teardown]    Close Browser