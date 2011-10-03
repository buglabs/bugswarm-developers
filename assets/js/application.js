$(document).ready(function() {

  // add prettyprint class to all <pre><code></code></pre> blocks
  $("pre code").parent().each(function() {
      $(this).addClass('prettyprint');
  });

  // Instantiate prettyprint
  prettyPrint();

  // Dropdown mouseover
  $(".nav-dropdown").mouseover(function () {
    $(".nav-dropdown").toggleClass('open');
  });

  $(".nav-dropdown").mouseout(function () {
    $(".nav-dropdown").toggleClass('open');
  });
});
