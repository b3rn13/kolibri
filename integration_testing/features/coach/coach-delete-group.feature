Feature: Coach deletes group
  Coach needs to delete a group that is not needed anymore

  Background:
    Given there are learners in the selected class
      And there is at least one group created and learners assigned to it
      And I am signed in to Kolibri as a coach user
      And I am on the *Coach > Plan > Groups* page

  Scenario: Coach deletes the group
    When I click the *Options* button
      And I select *Delete*
    Then the *Delete group* modal appears
    When I click the *Delete* button
    Then the modal closes
      And I don't see the deleted group
      And I see the snackbar notification
      # Snackbar is still not implemented here...?
    But if I click the *Cancel* button
    Then the modal closes
      And still see the group on the list
