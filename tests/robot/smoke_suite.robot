*** Settings ***
Library    SeleniumLibrary
Resource   resources/common_keywords.robot
Suite Teardown    Close Browser

*** Test Cases ***
Smoke Test 1 - Login Page Loads
    [Tags]    smoke
    Open Browser To Login Page
    Page Should Contain    Campus Canteen

Smoke Test 2 - Login Works
    [Tags]    smoke
    Login As Student
    Page Should Contain    Pre-Order Menu

Smoke Test 3 - Order Button Exists
    [Tags]    smoke
    Login As Student
    Page Should Contain Button    xpath=//button[text()='Order']