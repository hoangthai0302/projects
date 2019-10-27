$(document).ready(function(){
	jQuery('ul.nav li.dropdown').hover(
	function() {
		jQuery(this).find('.dropdown-menu').delay(400).queue(function(){
															$(this).addClass("block");
															$(this).dequeue();
														});
	  }, function() {
		 
			  jQuery(this).find('.dropdown-menu').stop(true, true).delay(200).removeClass( "block" );
		  
		 
	});
});
