$(document).ready(function(){

	// Google code prettify
	prettyPrint();

	// Dropdown mouseover
	$(".dropdown").mouseover(function () {
		$(".dropdown").toggleClass('open');
	});

	$(".dropdown").mouseout(function () {
		$(".dropdown").toggleClass('open');
	});

});
