$(document).ready(function() {

  // Instantiate prettyprint
  prettyPrint();

  // Navigation Dropdown mouseover
  $(".nav-dropdown").mouseover(function () {
    $(".nav-dropdown").toggleClass('open');
  });

  $(".nav-dropdown").mouseout(function () {
    $(".nav-dropdown").toggleClass('open');
  });

  // Jump To Dropdown Mouseover
  $(".jump-dropdown").mouseover(function () {
    $(".jump-dropdown").toggleClass('open jump-header-open');
  });

  $(".jump-dropdown").mouseout(function () {
    $(".jump-dropdown").toggleClass('open jump-header-open');
  });

});
