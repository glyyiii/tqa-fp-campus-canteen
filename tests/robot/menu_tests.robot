*** Settings ***
Library    SeleniumLibrary
Resource   resources/common_keywords.robot
Suite Setup    Login As Student
Suite Teardown    Close Browser

*** Test Cases ***
Menu Displays Items
    Wait Until Page Contains    Pancit Canton    timeout=5s
    Wait Until Page Contains    Fried Chicken    timeout=5s

Place An Order
    Click Button    xpath=//button[contains(text(), 'Order')][1]
    Handle Alert    accept
    Alert Should Not Be Present