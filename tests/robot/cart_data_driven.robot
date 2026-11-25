*** Settings ***
Library    SeleniumLibrary
Resource   resources/common_keywords.robot
Suite Setup    Login As Student
Suite Teardown    Close Browser
Test Template    Verify Menu Item Exists

*** Test Cases ***    ITEM_NAME
Order Pancit    Pancit Canton
Order Chicken    Fried Chicken
Order Rice    Rice
Order Coke    Coke Mismo

*** Keywords ***
Verify Menu Item Exists
    [Arguments]    ${item_name}
    Wait Until Page Contains    ${item_name}    timeout=5s