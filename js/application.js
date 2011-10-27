$(document).ready(function() {

  // Instantiate prettyprint
  prettyPrint();

  // Dropdown mouseover
  $('.nav-dropdown').mouseover(function() {
    $('.nav-dropdown').toggleClass('open');
  });

  $('.nav-dropdown').mouseout(function() {
    $('.nav-dropdown').toggleClass('open');
  });
});
