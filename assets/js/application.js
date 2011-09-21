$(document).ready(function(){

	// Google code prettify
	prettyPrint();

	// Dropdown mouseover
	$(".nav-dropdown").mouseover(function () {
		$(".nav-dropdown").toggleClass('open');
	});

	$(".nav-dropdown").mouseout(function () {
		$(".nav-dropdown").toggleClass('open');
	});

});
