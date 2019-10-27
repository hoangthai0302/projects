
function estimateTime(minutes){
	if(minutes < 10){
		return minutes + " MINUTES AGO";
	}
	if(minutes < 20){
		return "15 MINUTES AGO";
	}
	if(minutes < 30){
		return "20 MINUTES AGO";
	}
	if(minutes < 40){
		return "30 MINUTES AGO";
	}
	if(minutes < 120){
		return "AN HOUR AGO";
	}
	for(var i = 2; i <24;i++ ){
		
		if(minutes < i*60){
			return i + " HOURS AGO";
		}
	}
} 

$(document).ready(function(){

	//ẩn hiện comment box
	$('.comment_box').hide();
	$(".commentopen_button").click(function(e){
		e.preventDefault();
		var box = $(this).parent().parent().siblings('.comment_box');
		if($(box).is(":hidden")){
			$(box).slideDown('fast');
		}else{
			$(box).slideUp('fast');
		}
		
			
		
	});

	
		
});