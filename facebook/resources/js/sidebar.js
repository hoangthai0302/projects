$(document).ready(function(){
		$('.accordion >li>ul').hide();
		$('.accordion>li>a').click(function(){
			var index = $(this).parent().index();
			if($(this).parent().children('ul').length > 0){
				//close all sub menu
				$('.accordion >li:not(.collapsed)>ul').each(function(){
					var index2 = $(this).parent().index();
					if($(this).is(":hidden")){
						if(index2 == index){
							$(this).slideDown("fast");
							$(this).parent().addClass("opened");
						}
					}else{
						$(this).slideUp("fast");
						$(this).parent().removeClass("opened");
					}
				});
			}
		});
		$('#toggleSidebar').click(function(){
			var w = $(window).width();
			if(w >768){
				$(".accordion>li,.sidebar-user-info").toggleClass("collapsed");
				$(".accordion>li").removeClass("opened");
				$(".sidebar").toggleClass("wide");
				$(".accordion>li>ul").hide();
				if($(".accordion>li").hasClass("collapsed")){
					$("#content").css("padding-left","65px");
					$(".sidebar .logo").hide();
				}else{
					$("#content").css("padding-left","290px");
					$(".accordion>li>a").css("width","280px");
					$(".sidebar .logo").show();
				}
			}else{
				if($(".accordion").is(":hidden")){
					$(".accordion").slideDown();
				}else{
					$(".accordion").slideUp();
				}
                                $("#content").css("padding-left","0px");
			}
		});
		
		$(window).resize(function(){
			
			var w = $(window).width();
			$(".accordion>li.collapsed>ul").hide();
			var once = false;
			if (w <= 992 && w > 768){	
				$(".accordion>li,.sidebar-user-info").addClass("collapsed");
				$(".sidebar").removeClass("wide");
				$("#content").css("padding-left","65px");
				$(".sidebar .logo").hide();
				once = false;
			}
			
			if (w>1200 && !once){	
				once = true;
				$(".accordion>li,.sidebar-user-info").removeClass("collapsed");
				$(".sidebar").addClass("wide");
				$("#content").css("padding-left","280px");
				$(".sidebar .logo").show();
			}
			if(w<=768){
				$(".sidebar .logo").show();
				$(".accordion").hide();
                                $("#content").css("padding-left","0px");
				$(".accordion li a").css("width","auto");
				$(".accordion li,.sidebar-user-info").removeClass("collapsed");
			}else{
				if(!$(".accordion li").hasClass("collapsed")){
					$(".accordion li a").css("width","280px");
				}
				$(".accordion").show();
			}
			
			
		});
			
		
	});